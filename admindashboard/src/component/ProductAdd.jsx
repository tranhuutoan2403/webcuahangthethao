import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/product.css";

// --- Hàm Gợi ý Biến thể dựa trên Type (Constants) ---
const getVariantSuggestions = (type) => {
    switch (type) {
        case "ao-thun":
            return { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], colors: ["Đen", "Trắng", "Đỏ", "Xanh"] };
        case "giay-the-thao":
            return { sizes: ["38", "39", "40", "41", "42", "43", "44", "45"], colors: ["Đen", "Trắng", "Xám"] };
        case "vot-cau-long":
            // Đã bổ sung 'colors: []' để nhất quán với các case khác
            return { sizes: ["3U","4U"], colors: [] }; 
        default:
            return { sizes: [], colors: [] };
    }
};

function ProductAdd() {
    const navigate = useNavigate();
    
    // Đã đổi 'slug' thành 'product_slug' và thêm 'variant_type'
    const [formData, setFormData] = useState({
        productId: "",
        category_id: "",
        name: "",
        product_slug: "", // SLUG SẢN PHẨM THỰC TẾ (Mới)
        variant_type: "", // Loại gợi ý biến thể (Giống 'slug' cũ)
        description: "",
        price: "",
        stock: "",
        sizes: [], 
        colors: [], 
        selectedSizes: [], 
        selectedColors: [], 
    });

    const [file, setFile] = useState(null);
    const [colorFiles, setColorFiles] = useState({});
    const [categories, setCategories] = useState([]);
    const [isProductFound, setIsProductFound] = useState(false);

    // Biến cờ: True nếu đang tạo mới sản phẩm
    const isCreatingNew = !formData.productId || formData.productId.trim() === "" || !isProductFound;

    // --- CÁC HÀM XỬ LÝ CHUNG ---

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleFileChange = useCallback((e) => {
        setFile(e.target.files[0]);
    }, []);
    
    const handleColorFileChange = useCallback((e, color) => {
        setColorFiles(prev => ({ ...prev, [color]: e.target.files[0] }));
    }, []);

    const toggleSelection = (key, value) => {
        setFormData(prev => {
            const selected = prev[key];
            return {
                ...prev,
                [key]: selected.includes(value)
                    ? selected.filter(v => v !== value)
                    : [...selected, value],
            };
        });
    };

    // Hàm load gợi ý sizes/colors dựa trên variant_type (thay thế loadSlugOptions)
    const loadVariantOptions = useCallback((type) => {
        const { sizes, colors } = getVariantSuggestions(type);
        setFormData(prev => ({
            ...prev,
            variant_type: type,
            sizes,
            colors,
            selectedSizes: [],
            selectedColors: [],
        }));
    }, []);
    
    // Xử lý khi người dùng chọn Variant Type
    const handleVariantTypeChange = (e) => {
        const type = e.target.value;
        loadVariantOptions(type);
    };

    // --- LOGIC KIỂM TRA & LOAD DỮ LIỆU ---

    // A. Fetch Danh mục (Chỉ chạy 1 lần)
    useEffect(() => {
        axios.get("http://localhost:5000/api/products/categories")
            .then(res => setCategories(res.data))
            .catch(error => console.error("Lỗi khi lấy categories:", error));
    }, []);

    // B. Kiểm tra Product ID và load dữ liệu cơ bản
    const checkProductExistence = useCallback(async (id) => {
        const trimmedId = id.trim();
        if (!trimmedId) {
            setIsProductFound(false);
            setFormData(prev => ({ ...prev, sizes: [], colors: [], product_slug: '', name: '', description: '', price: '' }));
            return;
        }

        try {
            const res = await axios.get(`http://localhost:5000/api/products/check/${trimmedId}`);
            
            if (res.data.exists) {
                setIsProductFound(true);
                const { product_slug, variant_type, productName, price, description, category_id } = res.data;

                // Load options dựa trên variant_type từ backend (Nếu có)
                if (variant_type) {
                     loadVariantOptions(variant_type);
                }
                
                // Set các trường cơ bản
                setFormData(prev => ({ 
                    ...prev, 
                    product_slug: product_slug || prev.product_slug,
                    variant_type: variant_type || prev.variant_type, // Lưu type về state
                    category_id: category_id || prev.category_id,
                    name: productName || prev.name,
                    price: price || prev.price,
                    description: description || prev.description,
                }));

            } else {
                setIsProductFound(false);
                setFormData(prev => ({ ...prev, sizes: [], colors: [] }));
            }
        } catch (error) {
            setIsProductFound(false);
            setFormData(prev => ({ ...prev, sizes: [], colors: [] }));
        }
    }, [loadVariantOptions]);

    // C. Debounce check Product ID
    useEffect(() => {
        const handler = setTimeout(() => {
            checkProductExistence(formData.productId);
        }, 500); 
        
        return () => clearTimeout(handler);
    }, [formData.productId, checkProductExistence]);

    // --- LOGIC SUBMIT CUỐI CÙNG ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const productId = formData.productId.trim(); 
        const stockPerVariant = parseInt(formData.stock) || 0; 
        
        // 1. Kiểm tra validation cơ bản
        if (isCreatingNew) {
            if (!formData.name || !formData.price || !file || !formData.product_slug || !formData.category_id) {
                alert("Tạo sản phẩm mới cần: Danh mục, Tên, Giá, Slug sản phẩm, và Hình ảnh chính.");
                return;
            }
        }
        if (stockPerVariant <= 0) {
            alert("Vui lòng nhập số lượng tồn kho (Stock) hợp lệ cho các biến thể.");
            return;
        }
        if (formData.selectedColors.length === 0 && formData.selectedSizes.length === 0) {
             // Chỉ cảnh báo nếu người dùng đã chọn variant_type mà không chọn biến thể nào
            if(formData.variant_type) {
                 alert("Vui lòng chọn Kích cỡ và/hoặc Màu sắc để tạo ít nhất một biến thể.");
                 return;
            }
        }
        
        // 2. Tạo mảng biến thể
        const colorsToIterate = formData.selectedColors.length > 0 ? formData.selectedColors : [null];
        const sizesToIterate = formData.selectedSizes.length > 0 ? formData.selectedSizes : [null];
        const materialsArray = [];

        colorsToIterate.forEach(color => {
            sizesToIterate.forEach(size => {
                materialsArray.push({
                    color: color,
                    size: size,
                    stock: stockPerVariant,
                    image: color ? colorFiles[color]?.name : null 
                });
            });
        });

        // 3. Đóng gói FormData
        const data = new FormData();
        data.append("product_id", isProductFound ? productId : ""); 
        data.append("category_id", formData.category_id);
        data.append("name", formData.name);
        data.append("slug", formData.product_slug); // Gửi slug mới
        data.append("variant_type", formData.variant_type); // Gửi loại biến thể để lưu vào DB
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        
        if (file && isCreatingNew) {
            data.append("image", file);
        }
        
        data.append("variants", JSON.stringify(materialsArray));

        Object.keys(colorFiles).forEach(color => {
            if (colorFiles[color]) {
                data.append(`colorFile-${color}`, colorFiles[color]); 
            }
        });
        
        // 4. Gửi Request
        try {
            const endpoint = "http://localhost:5000/api/products/createOrUpdateProduct";
            await axios.post(endpoint, data, { 
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert(`Thành công! ${isCreatingNew ? 'Thêm sản phẩm mới' : 'Thêm biến thể'}.`);
            navigate("/product");
        } catch (err) {
            console.error("Lỗi khi xử lý sản phẩm:", err.response?.data || err);
            alert(`Thất bại: ${err.response?.data?.error || 'Lỗi server'}`);
        }
    };

    // Lớp CSS để làm nổi bật trường bắt buộc khi tạo mới
    const requiredClass = isCreatingNew ? 'required-field' : 'optional-field';

    // --- JSX HIỂN THỊ ---
    return (
        <div className="form-container">
            <h2>{isCreatingNew ? "THÊM SẢN PHẨM MỚI" : `THÊM BIẾN THỂ CHO SP: ${formData.name || formData.productId}`}</h2>
            <form onSubmit={handleSubmit}>
                
                {/* 1. TRƯỜNG PRODUCT ID */}
                <label>Product ID (Để trống nếu thêm sản phẩm mới)</label>
                <input
                    type="text"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    placeholder="Nhập ID sản phẩm đã có (ví dụ: 101)"
                />

                {/* THÔNG BÁO TÌNH TRẠNG SẢN PHẨM */}
                {formData.productId.trim() !== "" && (
                    isProductFound ? (
                        <div className="message success">✅ **Sản phẩm đã có!** Vui lòng **chọn Loại biến thể** nếu cần thay đổi loại biến thể (Size/Color), sau đó chọn biến thể và Hàng tồn.</div>
                    ) : (
                        <div className="message error">❌ **Không tìm thấy Sản phẩm.** Sẽ tạo sản phẩm mới.</div>
                    )
                )}
                
                <hr className="divider" />
                
                {/* 2. CÁC TRƯỜNG THÔNG TIN CƠ BẢN */}
                
                {/* Select Category */}
                <label className={requiredClass}>Danh mục {isCreatingNew && (<span style={{color:'red'}}>*</span>)}</label>
                <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required={isCreatingNew}
                    disabled={!isCreatingNew} 
                >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                        <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                    ))}
                </select>

                {/* Product Name */}
                <label className={requiredClass}>Tên Sản Phẩm {isCreatingNew && (<span style={{color:'red'}}>*</span>)}</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập tên sản phẩm"
                    required={isCreatingNew}
                    disabled={!isCreatingNew}
                />

                {/* Slug SẢN PHẨM MỚI - LUÔN CHO CHỌN (KHÔNG BỊ DISABLED) */}
                <label className={requiredClass}>**Slug Sản Phẩm** (Dùng cho URL) {isCreatingNew && (<span style={{color:'red'}}>*</span>)}</label>
                <input
                    type="text"
                    name="product_slug"
                    value={formData.product_slug}
                    onChange={handleChange}
                    placeholder="ví dụ: ao-thun-polo-chinh-hang"
                    required
                    disabled={!isCreatingNew && isProductFound} // Chỉ disable khi cập nhật biến thể cho sản phẩm đã có
                />
                
                {/* Loại Biến Thể (VARIANT TYPE) - LUÔN CHO CHỌN */}
                <label className="required-field">**Loại Biến Thể** (Dùng để gợi ý Size/Color)<span style={{color:'red'}}>*</span></label>
                <select
                    name="variant_type"
                    value={formData.variant_type}
                    onChange={handleVariantTypeChange} // Dùng hàm riêng để kích hoạt gợi ý
                    required
                >
                    <option value="">-- Chọn loại gợi ý --</option>
                    <option value="vot-cau-long">vot-cau-long</option>
                    {/* <option value="vot-pickle-ball">vot-pickle-ball</option> */}
                    <option value="ao-thun">ao-thun</option>
                    <option value="giay-the-thao">giay-the-thao</option>
                </select>

                {/* Description */}
                <label className={requiredClass}>Mô tả {isCreatingNew && (<span style={{color:'red'}}>*</span>)}</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả"
                    required={isCreatingNew}
                    disabled={!isCreatingNew}
                />

                {/* Price */}
                <label className={requiredClass}>Giá {isCreatingNew && (<span style={{color:'red'}}>*</span>)}</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Nhập giá"
                    required={isCreatingNew}
                    disabled={!isCreatingNew}
                />

                {/* Main Image */}
                <label className={requiredClass}>Hình sản phẩm chính {isCreatingNew && (<span style={{color:'red'}}>*</span>)}</label>
                <input 
                    type="file" 
                    name="image" 
                    onChange={handleFileChange} 
                    required={isCreatingNew} 
                    disabled={!isCreatingNew}
                />
                
                <hr className="divider" />

                {/* 3. CÁC TRƯỜNG BIẾN THỂ (MATERIALS) */}
                
                {/* Sizes */}
                {formData.sizes.length > 0 && (
                    <div className="preview-section">
                        <label>Kích cỡ (Chọn để tạo biến thể mới):</label>
                        <div className="button-group">
                            {formData.sizes.map((size, idx) => (
                                <button
                                    type="button"
                                    key={idx}
                                    className={`btn-item ${formData.selectedSizes.includes(size) ? 'active' : ''}`}
                                    onClick={() => toggleSelection('selectedSizes', size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Colors */}
                {formData.colors.length > 0 && (
                    <div className="preview-section">
                        <label>Màu sắc (Chọn để tạo biến thể mới):</label>
                        <div className="button-group">
                            {formData.colors.map((color, idx) => (
                                <div key={idx} className="color-item">
                                    <button
                                        type="button"
                                        className={`btn-item ${formData.selectedColors.includes(color) ? 'active' : ''}`}
                                        onClick={() => toggleSelection('selectedColors', color)}
                                    >
                                        {color}
                                    </button>
                                    {formData.selectedColors.includes(color) && (
                                        <input
                                            type="file"
                                            onChange={(e) => handleColorFileChange(e, color)}
                                            required={!isCreatingNew} // Yêu cầu file ảnh khi thêm biến thể (không phải sản phẩm mới)
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stock */}
                <label className="required-field">Hàng tồn (Stock ban đầu cho mỗi biến thể)<span style={{color:'red'}}>*</span></label>
                <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Nhập số lượng tồn kho (ví dụ: 20)"
                    required
                />

                <button type="submit">
                    {isCreatingNew ? "THÊM SẢN PHẨM" : "THÊM BIẾN THỂ"}
                </button>
            </form>
        </div>
    );
}

export default ProductAdd;