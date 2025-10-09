// VoucherUpdate.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/productupdate.css"; // Giữ nguyên CSS/className

export default function VoucherUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

  // Lấy dữ liệu voucher ban đầu
  useEffect(() => {
    fetch(`http://localhost:5000/api/vouchers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          code: data.code || "",
          description: data.description || "",
          discount_type: data.discount_type || "percent",
          discount_value: data.discount_value || "",
          min_order_amount: data.min_order_amount || 0,
          usage_limit: data.usage_limit || 1,
          start_date: data.start_date ? data.start_date.slice(0, 10) : "",
          end_date: data.end_date ? data.end_date.slice(0, 10) : "",
          status: data.status || "active",
        });
      })
      .catch((err) => console.error("Lỗi khi lấy dữ liệu voucher:", err));
  }, [id]);

  // Xử lý input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Cập nhật voucher
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.code || !formData.discount_value) {
      alert("Vui lòng nhập mã voucher và giá trị giảm giá!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/vouchers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        alert("Cập nhật voucher thành công!");
        navigate("/voucher"); // Điều hướng về danh sách voucher
      } else {
        alert(data.error || "Lỗi khi cập nhật voucher!");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật voucher:", err);
      alert("Lỗi kết nối đến máy chủ!");
    }
  };

  return (
    <div className="update-form-container">
      <h2>Cập nhật Voucher</h2>
      <form onSubmit={handleUpdate}>
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

        <button type="submit">Cập nhật Voucher</button>
      </form>
    </div>
  );
}
