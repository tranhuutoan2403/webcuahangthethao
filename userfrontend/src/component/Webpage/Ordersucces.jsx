// src/pages/OrderSuccess.jsx
import { useParams, Link } from "react-router-dom";
import "../CSS/ordersucces.css";
export default function OrderSuccess() {
  const { id } = useParams(); // lấy order_id từ URL

  return (
    <div className="order-container">
      <h2>Đặt hàng thành công!</h2>
      <p>Mã đơn hàng của bạn: <strong>{id}</strong></p>
      <p>Cảm ơn bạn đã mua hàng.</p>
      <Link to="/">Quay lại trang chủ</Link>
    </div>
  );
}
