import React, { useState } from "react";
import api from "../api";
import "../CSS/productupdate.css";

function FlashSaleAdd() {
  const [form, setForm] = useState({
    name: "",
    discount_type: "percent",
    discount_value: "",
    start_at: "",
    end_at: "",
    description: "",
    status: "scheduled",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/flashsales", form);
      // alert("Thêm flash sale thành công!");
      window.location.href = "/flash-sale";
    } catch (err) {
      console.error(err.response?.data || err.message);
      // alert("Thêm flash sale thất bại.");
    }
  };

  return (
    <div className="update-form-container">
      <h2>Thêm Flash Sale</h2>
      <form onSubmit={handleSubmit}>
        {/* Tên flash sale */}
        <label>Tên flash sale:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nhập tên flash sale"
          required
        />

        {/* Mô tả */}
        <label>Mô tả:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Nhập mô tả (tùy chọn)"
        />

        {/* Loại giảm giá */}
        <label>Loại giảm giá:</label>
        <select
          name="discount_type"
          value={form.discount_type}
          onChange={handleChange}
        >
          <option value="percent">Phần trăm (%)</option>
          <option value="fixed">Giá cố định</option>
        </select>

        {/* Giá trị giảm */}
        <label>Giá trị giảm:</label>
        <input
          type="number"
          name="discount_value"
          value={form.discount_value}
          onChange={handleChange}
          placeholder="Nhập giá trị giảm"
          required
        />

        {/* Bắt đầu */}
        <label>Bắt đầu:</label>
        <input
          type="datetime-local"
          name="start_at"
          value={form.start_at}
          onChange={handleChange}
          required
        />

        {/* Kết thúc */}
        <label>Kết thúc:</label>
        <input
          type="datetime-local"
          name="end_at"
          value={form.end_at}
          onChange={handleChange}
          required
        />

        {/* Trạng thái */}
        <label>Trạng thái:</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="scheduled">Scheduled</option>
          <option value="active">Active</option>
          <option value="ended">Ended</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button type="submit">Thêm Flash Sale</button>
      </form>
    </div>
  );
}

export default FlashSaleAdd;
