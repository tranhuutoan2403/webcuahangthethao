import React, { useEffect, useState } from "react";
import api from "../api"; // axios instance có token
import "../CSS/user.css";

function FlashSales() {
  const [flashSales, setFlashSales] = useState([]);

  // Lấy danh sách flash sales
  const fetchFlashSales = async () => {
    try {
      const res = await api.get("/flash-sale");
      setFlashSales(res.data);
    } catch (err) {
      console.error("Lỗi khi tải flash sales:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchFlashSales();
  }, []);

  // Xóa flash sale
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa flash sale này?")) return;
    try {
      await api.delete(`/flash-sale/${id}`);
      // alert("Xóa flash sale thành công!");
      fetchFlashSales();
    } catch (err) {
      console.error(err.response?.data || err.message);
      // alert("Xóa thất bại.");
    }
  };

  return (
    <div className="user-list">
      <button
        className="edit-btn"
        onClick={() => (window.location.href = "/flash-sale/add")}
      >
        Thêm Flash Sale
      </button>

      <h2>Danh sách Flash Sales</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Giảm giá (%)</th>
            <th>Thời gian</th>
            <th>Status</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {flashSales.length > 0 ? (
            flashSales.map((fs) => (
              <tr key={fs.flash_sale_id}>
                <td>{fs.flash_sale_id}</td>
                <td>{fs.name}</td>
                <td>{fs.discount_type === "percent" ? fs.discount_value + "%" : fs.discount_value}</td>
                <td>
                  {new Date(fs.start_at).toLocaleString()} - {new Date(fs.end_at).toLocaleString()}
                </td>
                <td>{fs.status}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => (window.location.href = `/flash-sale/update/${fs.flash_sale_id}`)}
                  >
                    Sửa
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(fs.flash_sale_id)}
                  >
                    Xóa
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => (window.location.href = `/flashsale-products/${fs.flash_sale_id}`)}
                  >
                    Quản lý sản phẩm
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Không có flash sale nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FlashSales;
