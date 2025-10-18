import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ Import useParams
import axios from "axios";
import JoditEditor from "jodit-react";

import "../CSS/product.css";

// ✅ Gợi ý size (Giữ lại để hiển thị/kiểm tra logic)
const variantSuggestions = {
  "Áo Thun": { sizes: ["S", "M", "L", "XL", "XXL"], imagePerColor: false },
  "Giày Cầu Lông": { sizes: ["38", "39", "40", "41", "42", "43", "44"], imagePerColor: true },
  "Vợt Cầu Lông": { sizes: ["3U", "4U"], imagePerColor: false },
};

// ✅ Bảng màu chung 10 màu
const colorPalette = [
  "Đen", "Trắng", "Đỏ", "Xanh", "Vàng", "Xám",
  "Xanh Navy", "Hồng", "Nâu", "Cam",
];

function ProductDetail() {
  const { id } = useParams(); // ✅ Lấy product_id từ URL
  const navigate = useNavigate();
  const editor = useRef(null);

  // ===== Loading State =====
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // ===== Thông tin sản phẩm =====
  const [productData, setProductData] = useState({
    category_id: "",
    brand_id: "",
    name: "",
    slug: "",
    description: "", // HTML content
    price: "",
    image_url: "", // Để hiển thị ảnh cũ
  });
  const [file, setFile] = useState(null);
  const [editorContent, setEditorContent] = useState("");

  // ===== Danh sách category & brand =====
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // ===== Biến thể (Variants/Materials) =====
  const [productMaterials, setProductMaterials] = useState([]); // Biến thể hiện tại từ DB
  const [sizes, setSizes] = useState([]); // Sizes gợi ý theo category
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [colorFiles, setColorFiles] = useState({});
  const [imagePerColor, setImagePerColor] = useState(false);


  // ================== Fetch Dữ liệu (Chi tiết SP, Cat, Brand) ==================
  useEffect(() => {
    const fetchDependencies = axios.get("http://localhost:5000/api/category")
      .then(res => setCategories(res.data));
    
    const fetchBrands = axios.get("http://localhost:5000/api/brand")
      .then(res => setBrands(res.data));

    const fetchProduct = axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => {
        const product = res.data.product;
        const materials = res.data.materials;

        // 1. Cập nhật Product Data
        setProductData({
          category_id: product.category_id.toString(),
          brand_id: product.brand_id.toString(),
          name: product.name,
          slug: product.slug,
          description: product.description || "", // Giả định description là HTML
          price: product.price,
          image_url: product.image_url, 
        });
        setEditorContent(product.description || "");
        
        // 2. Cập nhật Biến thể (Materials)
        setProductMaterials(materials);
        
        // Tạo Stock Map và Selected Lists từ Materials
        const initialStockMap = {};
        const initialSizes = new Set();
        const initialColors = new Set();

        materials.forEach(m => {
          const sizeKey = m.size || ""; // Sử dụng "" nếu size là null
          initialStockMap[`${sizeKey}-${m.color}`] = m.stock;
          if (m.size) initialSizes.add(m.size);
          initialColors.add(m.color);
        });

        setStockMap(initialStockMap);
        setSelectedSizes(Array.from(initialSizes));
        setSelectedColors(Array.from(initialColors));
        
        return product; // Trả về product để setup variant suggestions
      });

    Promise.all([fetchDependencies, fetchBrands, fetchProduct])
      .then(([_, __, product]) => {
        // 3. Cập nhật Sizes gợi ý và ImagePerColor dựa trên Category
        const category = categories.find(c => c.category_id === product.category_id);
        if (category) {
          const variant = variantSuggestions[category.name] || { sizes: [], imagePerColor: false };
          setSizes(variant.sizes);
          setImagePerColor(variant.imagePerColor);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi fetch dữ liệu:", err);
        setLoading(false);
        // navigate('/product'); // Tùy chọn: chuyển hướng nếu lỗi
      });
  }, [id]); // Phụ thuộc vào ID sản phẩm

  // ================== Handle Input & Slugs ==================
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "name") {
      const generatedSlug = value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
      setProductData((prev) => ({ ...prev, name: value, slug: generatedSlug }));
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);
  
  const handleFileChange = useCallback((e) => {
    setFile(e.target.files[0]); // Chỉ cần lưu file mới để gửi lên server
  }, []);

  // ================== Biến thể Logic (Giống ProductAdd) ==================
  const toggleSelection = (key, value) => {
    if (!isEditing) return; // Chỉ cho phép thay đổi khi đang Edit
    if (key === "size") {
      setSelectedSizes((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    } else if (key === "color") {
      setSelectedColors((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    }
  };

  const handleStockChange = (size, color, value) => {
    if (!isEditing) return;
    const key = size ? `${size}-${color}` : `-${color}`;
    setStockMap((prev) => ({ ...prev, [key]: parseInt(value) || 0 }));
  };

  const handleColorFileChange = (e, color) => {
    if (!isEditing) return;
    setColorFiles((prev) => ({ ...prev, [color]: e.target.files[0] }));
  };

  // ================== Cấu hình JoditEditor (Dùng useMemo để ổn định) ==================
  const editorConfig = useMemo(
    () => ({
      readonly: !isEditing, // Chỉ cho phép Edit khi đang chế độ Edit
      height: 200,
      toolbarSticky: false,
      buttons: "bold,italic,underline,strikethrough,|,ul,ol,|,link,image,table,|,source",
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
    }),
    [isEditing] // Cấu hình thay đổi khi chuyển đổi chế độ Edit
  );
  
  // ✅ Hàm loại bỏ HTML (Cần cho backend nếu không lưu HTML)
  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };


  // ================== Submit/Update sản phẩm & variants ==================
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // 1. Chuẩn bị dữ liệu Product
    const finalDescription = productData.description.includes('<p') ? editorContent : stripHtml(editorContent);
    
    const productDataToSend = {
      ...productData,
      description: finalDescription, // Gửi nội dung từ Editor
      // Dùng '_method' để mô phỏng phương thức PUT/PATCH trong FormData cho Axios
      _method: 'PUT' 
    };

    const data = new FormData();
    Object.keys(productDataToSend).forEach((key) => data.append(key, productDataToSend[key]));
    if (file) {
        data.append("image", file); // Chỉ thêm file mới nếu có
    }
    
    // 2. Chuẩn bị dữ liệu Variants
    const variantsArray = [];
    const sizesToLoop = selectedSizes.length > 0 ? selectedSizes : [""];
    sizesToLoop.forEach((size) => {
        selectedColors.forEach((color) => {
            const sizeKey = size || "";
            const key = sizeKey ? `${sizeKey}-${color}` : `-${color}`; 
            
            variantsArray.push({
                size: sizeKey || null, 
                color,
                stock: stockMap[key] !== undefined ? stockMap[key] : 0,
                // Không xử lý ảnh từng màu trong form này, chỉ gửi tên nếu cần
                image: imagePerColor ? colorFiles[color]?.name || productMaterials.find(m => m.size === sizeKey && m.color === color)?.image_url || null : null,
            });
        });
    });

    const variantData = new FormData();
    variantData.append("product_id", id);
    variantData.append("variants", JSON.stringify(variantsArray));
    // Thêm các file mới (nếu có)
    if (imagePerColor) {
      Object.keys(colorFiles).forEach((color) => {
        if (colorFiles[color]) variantData.append(`colorFile-${color}`, colorFiles[color]);
      });
    }

    try {
      // ✅ Gọi API Update Product
      await axios.post(`http://localhost:5000/api/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Gọi API Update Variants (Materials)
      await axios.post(`http://localhost:5000/api/product-materials/update`, variantData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Cập nhật sản phẩm và biến thể thành công!");
      setIsEditing(false); // Thoát chế độ Edit
      // navigate(`/product/${id}`, { replace: true }); // Reload data
    } catch (err) {
      console.error(err);
      alert("Lỗi server khi cập nhật sản phẩm hoặc thêm biến thể");
    }
  };

  if (loading) {
    return <div className="loading-spinner">Đang tải chi tiết sản phẩm...</div>;
  }

  return (
    <div className="form-container">
      <h2>Chi tiết sản phẩm: {productData.name}</h2>
      
      <button 
        className={`edit-toggle-btn ${isEditing ? 'active' : ''}`} 
        onClick={() => setIsEditing(!isEditing)}
        style={{ marginBottom: '20px' }}
      >
        {isEditing ? "Hủy chỉnh sửa" : "Bật Chế độ Chỉnh sửa"}
      </button>

      <form onSubmit={handleUpdate}>
        {/* ================== THÔNG TIN CƠ BẢN ================== */}
        <label>Danh mục *</label>
        <select name="category_id" value={productData.category_id} onChange={handleChange} required disabled={!isEditing}>
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>
              {c.name}
            </option>
          ))}
        </select>

        <label>Thương hiệu *</label>
        <select name="brand_id" value={productData.brand_id} onChange={handleChange} required disabled={!isEditing}>
          <option value="">-- Chọn thương hiệu --</option>
          {brands.map((b) => (
            <option key={b.brand_id} value={b.brand_id}>
              {b.name}
            </option>
          ))}
        </select>

        <label>Tên sản phẩm *</label>
        <input type="text" name="name" value={productData.name} onChange={handleChange} required disabled={!isEditing} />

        <label>Slug sản phẩm *</label>
        <input type="text" name="slug" value={productData.slug} required disabled />

        <label>Mô tả</label>
        <JoditEditor
            key="jodit-product-detail-editor" // Giúp React biết đây là một instance duy nhất
            ref={editor}
            value={editorContent} 
            onChange={setEditorContent} 
            config={editorConfig} // Dùng config động
        />
        
        <label>Giá *</label>
        <input type="number" name="price" value={productData.price} onChange={handleChange} required disabled={!isEditing} />

        <label>Hình ảnh chính (Ảnh cũ: {productData.image_url})</label>
        <input type="file" onChange={handleFileChange} disabled={!isEditing} />

        {/* ================== BIẾN THỂ ================== */}
        {sizes.length > 0 && (
          <div>
            <label>Kích cỡ:</label>
            <div className="button-group">
              {sizes.map((size) => (
                <button type="button" key={size} className={selectedSizes.includes(size) ? "active" : ""} 
                        onClick={() => toggleSelection("size", size)} disabled={!isEditing}>
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label>Màu sắc:</label>
          <div className="button-group">
            {colorPalette.map((color) => (
              <button type="button" key={color} className={selectedColors.includes(color) ? "active" : ""} 
                      onClick={() => toggleSelection("color", color)} disabled={!isEditing}>
                {color}
              </button>
            ))}
          </div>
        </div>

        {imagePerColor && selectedColors.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <h3>Ảnh từng màu (Chỉ upload nếu muốn thay đổi)</h3>
            {selectedColors.map((color) => (
              <div key={color}>
                <span>{color}: </span>
                <input type="file" onChange={(e) => handleColorFileChange(e, color)} disabled={!isEditing} />
                {/* 💡 Thêm hiển thị ảnh cũ nếu có */}
                {productMaterials.find(m => m.color === color)?.image_url && 
                  <span style={{marginLeft: '10px', fontSize: '12px'}}>Ảnh cũ có sẵn</span>}
              </div>
            ))}
          </div>
        )}
        
        {/* ================== NHẬP STOCK ================== */}
        {(selectedSizes.length > 0 || selectedColors.length > 0) && (
          <div style={{ marginTop: "20px" }}>
            <h3>Nhập số lượng cho từng biến thể</h3>
            {selectedColors.map((color) =>
                (selectedSizes.length > 0 ? selectedSizes : [""]).map((size) => {
                  const sizeKey = size || "";
                  const key = sizeKey ? `${sizeKey}-${color}` : `-${color}`;
                  
                  return (
                    <div key={key}>
                      <span>
                        {sizeKey ? `${sizeKey} - ${color}` : color}:{" "}
                      </span>
                      <input
                        type="number"
                        value={stockMap[key] !== undefined ? stockMap[key] : ""}
                        onChange={(e) => handleStockChange(sizeKey, color, e.target.value)}
                        disabled={!isEditing}
                        min="0"
                      />
                    </div>
                  );
                })
            )}
          </div>
        )}

        {isEditing && (
            <button type="submit" style={{ marginTop: "20px" }}>
                Lưu thay đổi sản phẩm
            </button>
        )}
      </form>
    </div>
  );
}

export default ProductDetail;