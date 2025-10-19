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

    // Lấy danh sách order cơ bản
    fetch(`http://localhost:5000/api/orders/user/${user.user_id}`)
      .then((res) => res.json())
      .then(async (data) => {
        const ordersArray = Array.isArray(data) ? data : [data];

        // Với mỗi order, nếu chưa có items, fetch chi tiết order để lấy items
        const fullOrders = await Promise.all(
          ordersArray.map(async (order) => {
            if (!order.items) {
              const resDetail = await fetch(
                `http://localhost:5000/api/orders/${order.order_id}`
              );
              const detailed = await resDetail.json();
              return { ...order, items: detailed.items || [] };
            }
            return order;
          })
        );

        setOrders(fullOrders);
      })
      .catch((err) => console.error("Lỗi lấy đơn hàng:", err));
  }, []);

  return (
  <div className="myorders-container">
  <h2>Đơn hàng của tôi</h2>
  {orders.length === 0 ? (
    <p>Bạn chưa có đơn hàng nào.</p>
  ) : (
    orders.map((order) => (
      <div className="order-card" key={order.order_id}>
        <div className="order-header">
          <div className="order-id">Mã đơn: {order.order_id}</div>
          <div className="order-date">
            {new Date(order.created_at).toLocaleString("vi-VN")}
          </div>
        </div>

        <div className="order-items">
          {order.items?.length > 0 ? (
            order.items.map((item, index) => (
              <div className="product-item" key={index}>
                <div className="product-name">{item.product_name}</div>
                <div className="product-quantity">x{item.quantity}</div>
                <div className="product-price">
                  {Number(item.price).toLocaleString("vi-VN")} VNĐ
                </div>
              </div>
            ))
          ) : (
            <div className="no-product">Chưa có sản phẩm</div>
          )}
        </div>

        <div className="order-total">
          Tổng: {Number(order.final_amount).toLocaleString("vi-VN")} VNĐ
        </div>

        <span className={`status ${order.status}`}>{order.status}</span>
      </div>
    ))
  )}
</div>

  );
}
