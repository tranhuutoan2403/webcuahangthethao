// BrandUpdate.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../CSS/productupdate.css";

export default function BrandUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    slug: ""
  });

  // ✅ Hàm tạo slug từ tên
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
      .replace(/\s+/g, "-") // thay khoảng trắng bằng dấu -
      .replace(/[^a-z0-9-]/g, ""); // loại bỏ ký tự đặc biệt
  };

  // Lấy dữ liệu brand ban đầu
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/brand/${id}`);
        const { name, slug } = res.data;
        setFormData({ name, slug });
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        alert("Không thể tải dữ liệu thương hiệu.");
      }
    };
    fetchBrand();
  }, [id]);

  // ✅ Xử lý input text — tự động cập nhật slug khi sửa tên
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData({
        ...formData,
        name: value,
        slug: generateSlug(value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Cập nhật brand
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/brand/${id}`, formData);
      alert("Cập nhật thương hiệu thành công!");
      navigate("/brand");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err.response || err);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="update-form-container">
      <h2>Cập nhật Thương Hiệu</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Tên thương hiệu:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Slug:</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            disabled // ✅ Khóa không cho người dùng chỉnh sửa slug
          />
        </div>

        <div>
          <button type="submit">Lưu</button>
        </div>
      </form>
    </div>
  );
}
