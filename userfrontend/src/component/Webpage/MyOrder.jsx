import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/myorders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

    useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.user_id) {
      alert("Vui lòng đăng nhập để xem đơn hàng của bạn!");
      navigate("/login");
      return;
    }
    fetch(`http://localhost:5000/api/orders/user/${user.user_id}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Lỗi lấy đơn hàng:", err));
  }, []);

  return (
    <div className="myorders-container">
      <h2>Đơn hàng của tôi</h2>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{new Date(order.created_at).toLocaleString("vi-VN")}</td>
                <td>{Number(order.final_amount).toLocaleString("vi-VN")} ₫</td>
                <td>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
