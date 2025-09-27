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

  // Lấy dữ liệu thương hiệu ban đầu
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/brand/${id}`)
      .then((res) => {
        const { name, slug } = res.data;
        setFormData({ name, slug });
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
        // alert("Không thể tải dữ liệu thương hiệu.");
      });
  }, [id]);

  // Xử lý input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Cập nhật thương hiệu
  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:5000/api/brand/${id}`, formData)
      .then(() => {
        // alert("Cập nhật thương hiệu thành công!");
        navigate("/brand");
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật:", err);
        // alert("Cập nhật thương hiệu thất bại!");
      });
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
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <button type="submit">Lưu</button>
        </div>
      </form>
    </div>
  );
}
