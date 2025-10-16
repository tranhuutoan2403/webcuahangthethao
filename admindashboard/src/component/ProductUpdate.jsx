import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import JoditEditor from "jodit-react";

import "../CSS/productupdate.css"; // Đảm bảo file CSS này tồn tại

// Gợi ý size theo danh mục
const variantSuggestions = {
  "Áo Thun": { sizes: ["S", "M", "L", "XL", "XXL"], imagePerColor: false },
  "Giày Cầu Lông": { sizes: ["38", "39", "40", "41", "42", "43", "44"], imagePerColor: true },
  "Vợt Cầu Lông": { sizes: ["3U", "4U"], imagePerColor: false },
  "Vợt PickleBall": { sizes: ["3U", "4U"], imagePerColor: false },
  "Vợt Tennis": { sizes: ["3U", "4U"], imagePerColor: false },
};

// Bảng màu chung
const colorPalette = [
  "Đen", "Trắng", "Đỏ", "Xanh", "Vàng", "Xám", "Xanh Navy", "Hồng", "Nâu", "Cam",
];

export default function ProductUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);

  const [formData, setFormData] = useState({
    category_id: "",
    brand_id: "",
    name: "",
    slug: "",
    description: "", // Giữ nguyên nội dung HTML từ Jodit
    price: "",
    image: "", // Tên ảnh chính hiện tại
  });
  const [file, setFile] = useState(null); // File ảnh chính mới
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu

  // Biến thể
  const [sizes, setSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [colorFiles, setColorFiles] = useState({}); // Lưu File object mới hoặc string (tên file cũ)
  const [imagePerColor, setImagePerColor] = useState(false);

  // ================== 1. Fetch data cơ bản (Product, Categories, Brands) ==================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tải Categories và Brands trước
        const [catRes, brandRes] = await Promise.all([
          axios.get("http://localhost:5000/api/categogy"),
          axios.get("http://localhost:5000/api/brand")
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);

        // Tải sản phẩm
        const productRes = await axios.get(`http://localhost:5000/api/products/${id}`);
        const { category_id, brand_id, name, slug, description, price, image } = productRes.data;

        // Cập nhật formData một lần
        setFormData({ category_id, brand_id, name, slug, description, price, image });

        setIsLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu ban đầu:", err);
        alert("Không thể tải dữ liệu sản phẩm.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]); // CHỈ phụ thuộc vào ID, đảm bảo không chạy lại khi state thay đổi

  // ================== 2. Fetch Biến thể (Variants) ==================
  const fetchVariants = useCallback(async (currentCategoryId, currentCategories) => {
    if (!currentCategoryId || currentCategories.length === 0) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/product-materials/${id}`);
      const materials = res.data;

      const category = currentCategories.find(c => c.category_id === parseInt(currentCategoryId));
      const variant = variantSuggestions[category?.name] || { sizes: [], imagePerColor: false };

      // Cập nhật gợi ý size và trạng thái ảnh theo màu
      setSizes(variant.sizes);
      setImagePerColor(variant.imagePerColor);

      if (materials.length > 0) {
        const sizesSet = new Set();
        const colorsSet = new Set();
        const stockTmp = {};
        const colorFileTmp = {};

        for (let m of materials) {
          if (m.size) sizesSet.add(m.size);
          if (m.color) colorsSet.add(m.color);

          const key = `${m.size || ""}-${m.color || ""}`;
          // Giả định backend trả về stock trong API này. Nếu không, phải gọi API stock riêng
          if (m.stock !== undefined) {
             stockTmp[key] = m.stock;
          } else if (m.material_id) {
             // FALLBACK: Gọi API stock riêng (chậm hơn)
             const stockRes = await axios.get(`http://localhost:5000/api/product-materials/${m.material_id}/stock`);
             stockTmp[key] = stockRes.data.stock || 0;
          }

          if (m.image) colorFileTmp[m.color] = m.image; // Lưu tên file ảnh cũ
        }

        setSelectedSizes(Array.from(sizesSet).length > 0 ? Array.from(sizesSet) : variant.sizes);
        setSelectedColors(Array.from(colorsSet));
        setStockMap(stockTmp);
        setColorFiles(colorFileTmp);
      } else {
        // Nếu chưa có material, áp dụng gợi ý mặc định
        setSelectedSizes(variant.sizes);
        setSelectedColors([]);
        setStockMap({});
        setColorFiles({});
      }
    } catch (err) {
      console.error("Lỗi khi tải biến thể:", err);
    }
  }, [id]);

  // Gọi fetchVariants sau khi dữ liệu cơ bản đã tải xong
  useEffect(() => {
    if (!isLoading && formData.category_id && categories.length > 0) {
      fetchVariants(formData.category_id, categories);
    }
  }, [isLoading, formData.category_id, categories, fetchVariants]);

  // ================== Handle Input ==================

  // Hàm xử lý chung cho input/select
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    // Đây là bước quan trọng: cập nhật state
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []); // Không có dependency, không chạy lại

  // Hàm xử lý file ảnh chính
  const handleFileChange = (e) => setFile(e.target.files[0]);

  // ================== Handle Biến thể ==================

  // Xử lý toggle size/color
  const toggleSelection = (key, value) => {
    if (key === "size") {
      setSelectedSizes(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    } else if (key === "color") {
      setSelectedColors(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    }
  };

  // Xử lý nhập số lượng tồn kho
  const handleStockChange = (size, color, value) => {
    const key = `${size || ""}-${color || ""}`;
    setStockMap(prev => ({ ...prev, [key]: parseInt(value) || 0 }));
  };

  // Xử lý file ảnh từng màu
  const handleColorFileChange = (e, color) => {
    const file = e.target.files.length > 0 ? e.target.files[0] : null;
    setColorFiles(prev => ({ ...prev, [color]: file }));
  };


  // ================== Submit ==================
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { category_id, brand_id, name, slug, price, description } = formData;
    if (!category_id || !brand_id || !name || !slug || !price) {
      alert("Vui lòng nhập đầy đủ thông tin sản phẩm bắt buộc!");
      return;
    }
    try {
      // 1. Cập nhật thông tin sản phẩm
      const productData = new FormData();
      Object.keys(formData).forEach(k => {
        // Append tất cả các trường, bao gồm HTML description
        productData.append(k, formData[k]);
      });
      if (file) productData.append("image", file); // Thêm ảnh chính mới (nếu có)

      await axios.put(`http://localhost:5000/api/products/${id}`, productData);


      // 2. Cập nhật/Tạo biến thể (Materials)
      const variantsArray = [];
      const sizesToIterate = selectedSizes.length > 0 ? selectedSizes : [""];
      const colorsToIterate = selectedColors.length > 0 ? selectedColors : [""];

      sizesToIterate.forEach(size => {
        colorsToIterate.forEach(color => {
          const key = `${size || ""}-${color || ""}`;
          const stockValue = stockMap[key] || 0;
          const colorFile = colorFiles[color];

          let imageName = null;
          if (imagePerColor) {
             if (colorFile instanceof File) {
                 imageName = colorFile.name; // Tên file mới
             } else if (typeof colorFile === "string") {
                 imageName = colorFile; // Tên file cũ từ DB
             }
          }

          variantsArray.push({
            size,
            color,
            stock: stockValue,
            image: imageName, // Gửi tên file (mới hoặc cũ) để backend lưu vào DB
          });
        });
      });

      const variantData = new FormData();
      variantData.append("product_id", id);
      variantData.append("variants", JSON.stringify(variantsArray)); // Mảng biến thể

      // Thêm các file ảnh biến thể MỚI vào FormData để upload
      if (imagePerColor) {
        Object.keys(colorFiles).forEach(color => {
          const fileOrString = colorFiles[color];
          if (fileOrString instanceof File) {
            variantData.append(`colorFile-${color}`, fileOrString);
          }
        });
      }

      await axios.put(`http://localhost:5000/api/product-materials/upsert/${id}`, variantData);

      alert("Cập nhật sản phẩm và biến thể thành công!");
      navigate("/product");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại!");
    }
  };

  if (isLoading) {
    return <div className="update-form-container">Đang tải dữ liệu...</div>;
  }

  // ================== Render ==================
  return (
    <div className="update-form-container">
      <h2>Cập nhật sản phẩm</h2>
      <form onSubmit={handleUpdate}>
        
        {/* Category */}
        <label>Danh mục *</label>
        <select name="category_id" value={formData.category_id} onChange={handleChange} required>
          <option value="">-- Chọn danh mục --</option>
          {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
        </select>

        {/* Brand */}
        <label>Thương hiệu *</label>
        <select name="brand_id" value={formData.brand_id} onChange={handleChange} required>
          <option value="">-- Chọn thương hiệu --</option>
          {brands.map(b => <option key={b.brand_id} value={b.brand_id}>{b.name}</option>)}
        </select>

        {/* Name */}
        <label>Tên sản phẩm *</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        {/* Slug */}
        <label>Slug sản phẩm *</label>
        <input type="text" name="slug" value={formData.slug} onChange={handleChange} required />

        {/* Description (JoditEditor) */}
        <label>Mô tả</label>
        <JoditEditor
            ref={editor}
            value={formData.description}
            // Lưu toàn bộ nội dung (HTML) vào formData.description
            onChange={content => setFormData(prev => ({ ...prev, description: content }))}
        />

        {/* Price */}
        <label>Giá *</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        {/* Main Image */}
        <label>Hình ảnh chính *</label>
        <input type="file" onChange={handleFileChange} />
        {formData.image && (
          <img 
            src={`http://localhost:5000/images/${formData.image}`} 
            alt="Hình sản phẩm" 
            style={{ width: '200px', height: 'auto', display: 'block', marginTop: '10px' }}
          />
        )}

        {/* Size Selection */}
        {sizes.length > 0 && (
          <div>
            <label style={{ marginTop: '20px', display: 'block' }}>Kích cỡ:</label>
            <div className="button-group">
              {sizes.map(size => (
                <button
                  type="button"
                  key={size}
                  className={selectedSizes.includes(size) ? "active" : ""}
                  onClick={() => toggleSelection("size", size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        <div>
          <label style={{ marginTop: '20px', display: 'block' }}>Màu sắc:</label>
          <div className="button-group">
            {colorPalette.map(color => (
              <button
                type="button"
                key={color}
                className={selectedColors.includes(color) ? "active" : ""}
                onClick={() => toggleSelection("color", color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Image Per Color */}
        {imagePerColor && selectedColors.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Ảnh từng màu</h3>
            {selectedColors.map(color => (
              <div key={color} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ minWidth: '80px' }}>{color}: </span>
                <input type="file" onChange={e => handleColorFileChange(e, color)} style={{ marginRight: '10px' }} />
                {colorFiles[color] && (
                  <img
                    src={
                      typeof colorFiles[color] === "string"
                        ? `http://localhost:5000/images/${colorFiles[color]}`
                        : URL.createObjectURL(colorFiles[color]) // Hiển thị ảnh mới tạm thời
                    }
                    alt={color}
                    width={50}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stock Input */}
        {(selectedSizes.length > 0 || selectedColors.length > 0) && (
          <div style={{ marginTop: '20px' }}>
            <h3>Nhập số lượng tồn kho</h3>
            {/* Logic lặp qua các biến thể đã chọn */}
            {(selectedSizes.length > 0 ? selectedSizes : [""]).map(size =>
              (selectedColors.length > 0 ? selectedColors : [""]).map(color => (
                <div key={`${size}-${color}`} style={{ marginBottom: '10px' }}>
                  <span>{size ? `${size} - ` : ''}{color || 'Mặc định'}: </span>
                  <input
                    type="number"
                    value={stockMap[`${size || ""}-${color || ""}`] || ""}
                    onChange={e => handleStockChange(size, color, e.target.value)}
                    min="0"
                    style={{ marginLeft: '5px', padding: '10px' }}
                  />
                </div>
              ))
            )}
          </div>
        )}

        <button type="submit" style={{ marginTop: "30px", padding: '10px 20px' }}>Cập nhật sản phẩm & biến thể</button>
      </form>
    </div>
  );
}