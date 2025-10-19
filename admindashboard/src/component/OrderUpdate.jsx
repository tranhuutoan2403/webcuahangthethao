// 📄 src/pages/OrderUpdate.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/productupdate.css";

const OrderUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🧾 Lấy dữ liệu đơn hàng ban đầu
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // 📝 Xử lý thay đổi input
  const handleReceiverChange = (e) => {
    const { name, value } = e.target;
    setOrder({
      ...order,
      receiver: { ...order.receiver, [name]: value },
    });
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrder({
      ...order,
      [name]: value,
    });
  };

  // 📝 Xử lý thay đổi sản phẩm trong đơn hàng
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index][field] = value;

    // ✅ Tính lại subtotal
    updatedItems[index].subtotal =
      (Number(updatedItems[index].price) - Number(updatedItems[index].discount_amount)) *
      Number(updatedItems[index].quantity);

    setOrder({
      ...order,
      items: updatedItems,
    });
  };

  // 📌 Gửi PUT cập nhật đơn hàng
  const handleUpdate = async () => {
    setSaving(true);
    try {
      const payload = {
        receiver: order.receiver,
        status: order.status,
        total_amount: order.total_amount,
        final_amount: order.final_amount,
        items: order.items,
      };

      await axios.put(`http://localhost:5000/api/orders/${id}`, payload);
      alert("✅ Cập nhật đơn hàng thành công!");
      navigate("/order");
    } catch (err) {
      console.error("Lỗi khi cập nhật đơn hàng:", err);
      alert("❌ Cập nhật thất bại!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (!order) return <p>Không tìm thấy đơn hàng!</p>;

  return (
    <div className="update-form-container">
      <h2>Cập nhật Đơn Hàng #{order.order_id}</h2>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* 🧍 Thông tin người nhận */}
        <div className="form-section">
          <label>Người nhận:</label>
          <input
            type="text"
            name="name"
            value={order.receiver.name}
            onChange={handleReceiverChange}
          />

          <label>SĐT:</label>
          <input
            type="text"
            name="phone"
            value={order.receiver.phone}
            onChange={handleReceiverChange}
          />

          <label>Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={order.receiver.address}
            onChange={handleReceiverChange}
          />
        </div>

        {/* 💰 Tổng tiền và trạng thái */}
        <div className="form-section">
          <label>Tổng tiền:</label>
          <input
            type="number"
            name="total_amount"
            value={order.total_amount}
            onChange={handleOrderChange}
          />

          <label>Thành tiền sau giảm:</label>
          <input
            type="number"
            name="final_amount"
            value={order.final_amount}
            onChange={handleOrderChange}
          />

          <label>Trạng thái đơn hàng:</label>
          <select
            name="status"
            value={order.status}
            onChange={handleOrderChange}
          >
            <option value="pending">Chờ xác nhận</option>
            <option value="paid">Đã thanh toán</option>
            <option value="shipping">Đang giao</option>
            <option value="completed">Hoàn thành</option>
            <option value="canceled">Đã hủy</option>
          </select>
        </div>

        {/* 🛍 Danh sách sản phẩm */}
        <div className="form-section">
          <h3>Sản phẩm trong đơn</h3>
          <table className="order-items-table">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Giảm giá</th>
                <th>Tạm tính</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.product_name}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(idx, "quantity", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(idx, "price", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.discount_amount}
                      onChange={(e) =>
                        handleItemChange(idx, "discount_amount", e.target.value)
                      }
                    />
                  </td>
                  <td>{Number(item.subtotal).toLocaleString()} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📌 Nút cập nhật */}
        <div className="form-section">
          <button type="button" onClick={handleUpdate} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderUpdate;
