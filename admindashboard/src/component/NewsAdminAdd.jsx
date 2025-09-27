import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewsAdminAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    slug: "",
    content: "",
    status: "draft",
    published_at: "",
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.title) validationErrors.title = "Tiêu đề không được để trống";
    if (!formData.slug) validationErrors.slug = "Slug không được để trống";
    if (!formData.content) validationErrors.content = "Nội dung không được để trống";
    if (!formData.category_id) validationErrors.category_id = "Danh mục không được để trống";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = new FormData();
    data.append("category_id", formData.category_id);
    data.append("title", formData.title);
    data.append("slug", formData.slug);
    data.append("content", formData.content);
    data.append("status", formData.status);
    data.append("published_at", formData.published_at);
    if (image) data.append("image", image);

    setLoading(true);
    fetch("http://localhost:5000/api/news", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((resData) => {
        console.log("Response:", resData);
        setTimeout(() => {
          navigate("/news");
        }, 1000);

        setFormData({
          category_id: "",
          title: "",
          slug: "",
          content: "",
          status: "draft",
          published_at: "",
        });
        setImage(null);
        setErrors({});
      })
      .catch((err) => {
        console.error("Error when adding news:", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="update-form-container">
      <h2>Thêm Tin Tức</h2>
      <form onSubmit={handleSubmit}>
        {/* Danh mục */}
        <label>Danh mục</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn danh mục --</option>
          <option value="1">Tin tức</option>
          <option value="2">Giới thiệu</option>
          <option value="3">Hướng dẫn thanh toán</option>
          <option value="4">Hướng dẫn bảo hành</option>
        </select>
        {errors.category_id && <p className="error">{errors.category_id}</p>}

        {/* Tiêu đề */}
        <label>Tiêu đề</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Nhập tiêu đề"
          required
        />
        {errors.title && <p className="error">{errors.title}</p>}

        {/* Slug */}
        <label>Slug</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="Nhập slug (đường dẫn)"
          required
        />
        {errors.slug && <p className="error">{errors.slug}</p>}

        {/* Nội dung */}
        <label>Nội dung</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Nhập nội dung"
          rows={6}
          required
        />
        {errors.content && <p className="error">{errors.content}</p>}

        {/* Trạng thái */}
        <label>Trạng thái</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        {/* Ngày xuất bản */}
        <label>Ngày xuất bản</label>
        <input
          type="date"
          name="published_at"
          value={formData.published_at}
          onChange={handleChange}
        />

        {/* Ảnh */}
        <label>Ảnh</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Đang thêm..." : "Thêm"}
        </button>
      </form>
    </div>
  );
};

export default NewsAdminAdd;
