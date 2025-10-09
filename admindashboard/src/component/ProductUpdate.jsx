import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../CSS/productupdate.css";

export default function ProductUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category_id: "",
    brand_id: "",
    name: "",
    slug: "",
    description: "",
    price: "",
    image: "", // Tên file hiện tại
  });
  const [file, setFile] = useState(null); // File mới được chọn
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Lấy dữ liệu sản phẩm ban đầu
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const { category_id, brand_id, name, slug, description, price, image } = res.data;
        setFormData({ category_id, brand_id, name, slug, description, price, image });
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        alert("Không thể tải dữ liệu sản phẩm.");
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categogy");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchBrands = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/brand");
        setBrands(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
    fetchCategories();
    fetchBrands();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("category_id", formData.category_id);
    data.append("brand_id", formData.brand_id);
    data.append("name", formData.name);
    data.append("slug", formData.slug);
    data.append("description", formData.description);
    data.append("price", formData.price);
    if (file) {
      data.append("image", file);
    } else {
      data.append("image", formData.image);
    }

    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, data);
      alert("Cập nhật sản phẩm thành công!");
      navigate("/product");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      alert("Cập nhật sản phẩm thất bại!");
    }
  };

  return (
    <div className="update-form-container">
      <h2>Cập nhật Sản Phẩm</h2>
      <form onSubmit={handleUpdate}>
        <label>Danh mục *</label>
        <select name="category_id" value={formData.category_id} onChange={handleChange} required>
          <option value="">-- Chọn danh mục --</option>
          {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
        </select>

        <label>Thương hiệu *</label>
        <select name="brand_id" value={formData.brand_id} onChange={handleChange} required>
          <option value="">-- Chọn thương hiệu --</option>
          {brands.map(b => <option key={b.brand_id} value={b.brand_id}>{b.name}</option>)}
        </select>

        <label>Tên sản phẩm *</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Slug sản phẩm *</label>
        <input type="text" name="slug" value={formData.slug} onChange={handleChange} required />

        <label>Mô tả</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} />

        <label>Giá *</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <label>Hình ảnh chính *</label>
        <input type="file" onChange={handleFileChange} />

        {formData.image && (
          <img src={`http://localhost:5000/images/${formData.image}`} alt="Hình sản phẩm hiện tại" />
        )}

        <button type="submit">Lưu</button>
      </form>
    </div>
  );
}
