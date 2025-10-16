import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JoditEditor from "jodit-react"; // ✅ Thay vì ReactQuill

import "../CSS/product.css";

// ✅ Gợi ý size theo danh mục
const variantSuggestions = {
  "Áo Thun": { sizes: ["S", "M", "L", "XL", "XXL"], imagePerColor: false },
  "Giày Cầu Lông": { sizes: ["38", "39", "40", "41", "42", "43", "44"], imagePerColor: true },
  "Vợt Cầu Lông": { sizes: ["3U", "4U"], imagePerColor: false },
};

// ✅ Bảng màu chung 10 màu
const colorPalette = [
  "Đen",
  "Trắng",
  "Đỏ",
  "Xanh",
  "Vàng",
  "Xám",
  "Xanh Navy",
  "Hồng",
  "Nâu",
  "Cam",
];

function ProductAdd() {
  const navigate = useNavigate();
  const editor = useRef(null);

  // ===== Thông tin sản phẩm =====
  const [productData, setProductData] = useState({
    category_id: "",
    brand_id: "",
    name: "",
    slug: "",
    description: "",
    price: "",
  });
  const [file, setFile] = useState(null);

  // ===== Danh sách category & brand =====
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // ===== Biến thể =====
  const [sizes, setSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [colorFiles, setColorFiles] = useState({});
  const [imagePerColor, setImagePerColor] = useState(false);

  // ================== Fetch category & brand ==================
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categogy")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:5000/api/brand")
      .then((res) => setBrands(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ================== Handle product input ==================
  const handleChange = useCallback((e) => {
  const { name, value } = e.target;

  if (name === "name") {
    // ✅ Tạo slug tự động khi nhập tên sản phẩm
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")        // khoảng trắng -> gạch ngang
      .replace(/[^\w-]+/g, "");    // xóa ký tự đặc biệt

    setProductData((prev) => ({
      ...prev,
      name: value,
      slug: generatedSlug,
    }));
  } else {
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
}, []);

  // ✅ Hàm loại bỏ HTML
  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  // ✅ Thêm hàm xử lý mô tả — chỉ lấy text
  const handleDescriptionChange = useCallback((value) => {
    const plainText = stripHtml(value);
    setProductData((prev) => ({ ...prev, description: plainText }));
  }, []);

  const handleFileChange = useCallback((e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Cố định kích thước 400x400
      canvas.width = 400;
      canvas.height = 400;

      // Vẽ ảnh lên canvas, co dãn vừa 400x400
      ctx.drawImage(img, 0, 0, 400, 400);

      // Ghi chữ 400x400 lên ảnh
      ctx.font = "20px Arial";
      ctx.fillStyle = "red";
      ctx.fillText("400x400", 10, 30);

      // Chuyển canvas thành blob rồi tạo file mới
      canvas.toBlob((blob) => {
        setFile(new File([blob], file.name, { type: "image/jpeg" }));
      }, "image/jpeg", 0.9);
    };
  };
  reader.readAsDataURL(file);
}, []);

  // ================== Khi chọn category ==================
  useEffect(() => {
    if (!productData.category_id) return;
    const category = categories.find(
      (c) => c.category_id === parseInt(productData.category_id)
    );
    if (!category) return;
    const variant = variantSuggestions[category.name] || {
      sizes: [],
      imagePerColor: false,
    };
    setSizes(variant.sizes);
    setSelectedSizes(variant.sizes);
    setSelectedColors([]);
    setStockMap({});
    setColorFiles({});
    setImagePerColor(variant.imagePerColor);
  }, [productData.category_id, categories]);

  // ================== Toggle size/color ==================
  const toggleSelection = (key, value) => {
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

  // ================== Handle stock input ==================
  const handleStockChange = (size, color, value) => {
    const key = `${size}-${color}`;
    setStockMap((prev) => ({ ...prev, [key]: parseInt(value) || 0 }));
  };

  // ================== Handle color image ==================
  const handleColorFileChange = (e, color) => {
    setColorFiles((prev) => ({ ...prev, [color]: e.target.files[0] }));
  };

  // ================== Submit product + variants ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { category_id, brand_id, name, slug, price } = productData;
    if (!category_id || !brand_id || !name || !slug || !price || !file) {
      alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
      return;
    }

    try {
      const data = new FormData();
      Object.keys(productData).forEach((key) => data.append(key, productData[key]));
      data.append("image", file);

      // Tạo sản phẩm
      const res = await axios.post("http://localhost:5000/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const product_id = res.data.product_id;

      // Tạo biến thể
      const variantsArray = [];
      selectedSizes.forEach((size) => {
        selectedColors.forEach((color) => {
          const key = `${size}-${color}`;
          const stockValue =
            stockMap[key] !== undefined ? stockMap[key] : 0;
          variantsArray.push({
            size,
            color,
            stock: stockValue,
            image: imagePerColor ? colorFiles[color]?.name || null : null,
          });
        });
      });

      const variantData = new FormData();
      variantData.append("product_id", product_id);
      variantData.append("variants", JSON.stringify(variantsArray));
      if (imagePerColor) {
        Object.keys(colorFiles).forEach((color) => {
          if (colorFiles[color]) variantData.append(`colorFile-${color}`, colorFiles[color]);
        });
      }

      await axios.post("http://localhost:5000/api/product-materials", variantData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Tạo sản phẩm và thêm biến thể thành công!");
      navigate("/product");
    } catch (err) {
      console.error(err);
      alert("Lỗi server khi tạo sản phẩm hoặc thêm biến thể");
    }
  };

  return (
    <div className="form-container">
      <h2>Thêm sản phẩm mới</h2>
      <form onSubmit={handleSubmit}>
        <label>Danh mục *</label>
        <select
          name="category_id"
          value={productData.category_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>
              {c.name}
            </option>
          ))}
        </select>

        <label>Thương hiệu *</label>
        <select
          name="brand_id"
          value={productData.brand_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn thương hiệu --</option>
          {brands.map((b) => (
            <option key={b.brand_id} value={b.brand_id}>
              {b.name}
            </option>
          ))}
        </select>

        <label>Tên sản phẩm *</label>
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          required
        />

        <label>Slug sản phẩm *</label>
        <input
          type="text"
          name="slug"
          value={productData.slug}
          onChange={handleChange}
          required
          disabled
        />

        <label>Mô tả</label>
        <JoditEditor
          ref={editor}
          value={productData.description}
          onChange={handleDescriptionChange}
          placeholder="Nhập mô tả sản phẩm..."
        />

        <label>Giá *</label>
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          required
        />

        <label>Hình ảnh chính *</label>
        <input type="file" onChange={handleFileChange} required />

        {sizes.length > 0 && (
          <div>
            <label>Kích cỡ:</label>
            <div className="button-group">
              {sizes.map((size) => (
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

        <div>
          <label>Màu sắc:</label>
          <div className="button-group">
            {colorPalette.map((color) => (
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

        {imagePerColor && selectedColors.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <h3>Ảnh từng màu</h3>
            {selectedColors.map((color) => (
              <div key={color}>
                <span>{color}: </span>
                <input
                  type="file"
                  onChange={(e) => handleColorFileChange(e, color)}
                  required
                />
              </div>
            ))}
          </div>
        )}

        {(selectedSizes.length > 0 || selectedColors.length > 0) && (
          <div style={{ marginTop: "20px" }}>
            <h3>Nhập số lượng cho từng biến thể</h3>
            {selectedSizes.length > 0 && selectedColors.length > 0 ? (
              selectedSizes.map((size) =>
                selectedColors.map((color) => (
                  <div key={`${size}-${color}`}>
                    <span>
                      {size} - {color}:{" "}
                    </span>
                    <input
                      type="number"
                      value={stockMap[`${size}-${color}`] || ""}
                      onChange={(e) =>
                        handleStockChange(size, color, e.target.value)
                      }
                    />
                  </div>
                ))
              )
            ) : (
              selectedColors.map((color) => (
                <div key={color}>
                  <span>{color}: </span>
                  <input
                    type="number"
                    value={stockMap[`_-${color}`] || ""}
                    onChange={(e) =>
                      handleStockChange("_", color, e.target.value)
                    }
                  />
                </div>
              ))
            )}
          </div>
        )}

        <button type="submit" style={{ marginTop: "20px" }}>
          Thêm sản phẩm & biến thể
        </button>
      </form>
    </div>
  );
}

export default ProductAdd;
