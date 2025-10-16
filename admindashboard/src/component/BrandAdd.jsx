import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/product.css";

function BrandAdd() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const navigate = useNavigate();

  // ✅ Hàm tạo slug tự động
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Khi gõ tên → tự động sinh slug
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    setFormData({ name, slug });
  };

  // Nếu người dùng muốn chỉnh sửa slug thủ công
  const handleSlugChange = (e) => {
    setFormData({ ...formData, slug: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/brand", formData);
      navigate("/brand");
    } catch (err) {
      console.error("Lỗi khi thêm thương hiệu:", err);
    }
  };

  return (
    <div className="form-container">
      <h2>Thêm Thương Hiệu</h2>
      <form onSubmit={handleSubmit}>
        <label>Tên Thương Hiệu</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="Nhập tên thương hiệu"
          required
        />

        <label>Slug</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleSlugChange}
          placeholder="Tự động sinh từ tên (có thể chỉnh)"
          required
        />

        <button type="submit">Thêm thương hiệu</button>
      </form>
    </div>
  );
}

export default BrandAdd;
