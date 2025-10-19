import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Thêm dòng này

import "../CSS/orderadmin.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate(); // ✅ Khai báo navigate

  // ✅ Fetch dữ liệu đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Lỗi khi fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) return <p>Đang tải dữ liệu đơn hàng...</p>;

  return (
    <div className="order-page">
      <h2>Danh Sách Đơn Hàng</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>Mã ĐH</th>
            <th>Người Nhận</th>
            <th>SĐT</th>
            <th>Địa Chỉ</th>
            <th>Trạng Thái</th>
            <th>Tổng Tiền</th>
            <th>Ngày Tạo</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.order_id}>
              <tr>
                <td>#{order.order_id}</td>
                <td>{order.receiver.name}</td>
                <td>{order.receiver.phone}</td>
                <td>{order.receiver.address}</td>
                <td>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>{Number(order.final_amount).toLocaleString()} VND</td>
                <td>{new Date(order.created_at).toLocaleString("vi-VN")}</td>
                <td>
                  <button
                    className="btn-detail"
                    onClick={() => toggleExpand(order.order_id)}
                  >
                    {expandedOrder === order.order_id ? "Ẩn" : "Xem"}
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/order/update/${order.order_id}`)} // ✅ Sửa lại đúng đường dẫn
                  >
                    Sửa
                  </button>
                </td>
              </tr>

              {expandedOrder === order.order_id && (
                <tr className="order-details">
                  <td colSpan="8">
                    <h4>Danh sách sản phẩm:</h4>
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
                            <td>{item.quantity}</td>
                            <td>{Number(item.price).toLocaleString()} VND</td>
                            <td>{Number(item.discount_amount).toLocaleString()} VND</td>
                            <td>{Number(item.subtotal).toLocaleString()} VND</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Order;
