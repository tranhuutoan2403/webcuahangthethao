import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/product.css";

function CategoryAdd() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const navigate = useNavigate();

  // Hàm chuyển tên thành slug (không dấu, chữ thường, thay khoảng trắng = -)
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD") // tách dấu tiếng Việt
      .replace(/[\u0300-\u036f]/g, "") // xóa dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/\s+/g, "-") // thay khoảng trắng bằng dấu -
      .replace(/[^a-z0-9-]/g, "") // xóa ký tự đặc biệt
      .replace(/-+/g, "-") // gộp nhiều dấu - thành 1
      .replace(/^-+|-+$/g, ""); // xóa dấu - đầu & cuối
  };

  // Khi gõ tên → tự động cập nhật slug
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    setFormData({ name, slug });
  };

  // Nếu muốn người dùng vẫn có thể sửa slug thủ công
  const handleSlugChange = (e) => {
    setFormData({ ...formData, slug: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/category", formData);
      alert("Thêm loại sản phẩm thành công!");
      navigate("/category");
    } catch (err) {
      console.error("Lỗi khi thêm loại sản phẩm:", err);
      alert("Thêm loại sản phẩm thất bại!");
    }
  };

  return (
    <div className="form-container">
      <h2>Thêm Loại Sản Phẩm</h2>
      <form onSubmit={handleSubmit}>
        <label>Tên Loại</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="Nhập tên loại"
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

        <button type="submit">Thêm loại sản phẩm</button>
      </form>
    </div>
  );
}

export default CategoryAdd;
