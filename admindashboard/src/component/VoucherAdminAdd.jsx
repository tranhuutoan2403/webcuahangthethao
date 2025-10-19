import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/product.css";

function VoucherAdd() {
  const [formData, setFormData] = useState({
    category_id: "", // thêm category_id
    code: "",
    description: "",
    discount_type: "percent",
    discount_value: "",
    min_order_amount: 0,
    usage_limit: 1,
    start_date: "",
    end_date: "",
    status: "active",
  });

  const [categories, setCategories] = useState([]); // lưu danh sách category

  const navigate = useNavigate();

  // Lấy danh sách category
  useEffect(() => {
    fetch("http://localhost:5000/api/category")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi khi lấy category:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code || !formData.discount_value || !formData.category_id) {
      alert("Vui lòng nhập mã voucher, giá trị giảm giá và chọn danh mục!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: Number(formData.category_id), // gửi category_id
          code: formData.code,
          description: formData.description,
          discount_type: formData.discount_type,
          discount_value: Number(formData.discount_value),
          min_order_amount: Number(formData.min_order_amount),
          usage_limit: Number(formData.usage_limit),
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          status: formData.status,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Thêm voucher thành công!");
        navigate("/voucher");
      } else {
        alert(data.error || "Lỗi khi thêm voucher!");
      }
    } catch (err) {
      console.error("Lỗi khi thêm voucher:", err);
      alert("Lỗi kết nối đến máy chủ!");
    }
  };

  return (
    <div className="form-container">
      <h2>Thêm Voucher</h2>
      <form onSubmit={handleSubmit}>
        <label>Danh mục</label>
        <select
          name="category_id"
          value={formData.category_id}
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

        <label>Mã Voucher</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Nhập mã voucher"
          required
        />

        <label>Mô tả</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Nhập mô tả"
        />

        <label>Loại giảm giá</label>
        <select
          name="discount_type"
          value={formData.discount_type}
          onChange={handleChange}
        >
          <option value="percent">Phần trăm (%)</option>
          <option value="fixed">Tiền cố định</option>
        </select>

        <label>Giá trị giảm</label>
        <input
          type="number"
          name="discount_value"
          value={formData.discount_value}
          onChange={handleChange}
          required
        />

        <label>Giá trị đơn tối thiểu</label>
        <input
          type="number"
          name="min_order_amount"
          value={formData.min_order_amount}
          onChange={handleChange}
        />

        <label>Giới hạn lượt dùng</label>
        <input
          type="number"
          name="usage_limit"
          value={formData.usage_limit}
          onChange={handleChange}
        />

        <label>Ngày bắt đầu</label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
        />

        <label>Ngày kết thúc</label>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
        />

        <label>Trạng thái</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
          <option value="expired">Expired</option>
        </select>

        <button type="submit">Thêm Voucher</button>
      </form>
    </div>
  );
}

export default VoucherAdd;
