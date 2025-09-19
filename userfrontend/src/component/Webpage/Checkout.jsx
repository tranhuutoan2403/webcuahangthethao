import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/checkout.css";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [total, setTotal] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const navigate = useNavigate();

  // Load cart từ localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    const t = storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(t);
    setFinalAmount(t);
  }, []);

  // Áp dụng voucher giảm giá
  const handleApplyVoucher = async () => {
    if (!voucherCode) return alert("Vui lòng nhập mã giảm giá");
    if (cart.length === 0) return alert("Giỏ hàng trống");

    try {
      const res = await fetch(`http://localhost:5000/api/vouchers/code/${voucherCode}`);
      if (!res.ok) throw new Error("Mã giảm giá không hợp lệ hoặc hết hạn");
      const voucher = await res.json();

      // Ràng buộc: tổng tiền ≥ 1 triệu
      if (total < 1000000) {
        return alert("Đơn hàng phải từ 1.000.000 VNĐ để sử dụng voucher!");
      }

      let newAmount = total;
      if (voucher.discount_type === "percent") {
        newAmount = Math.round(total * (1 - voucher.discount_value / 100));
      } else if (voucher.discount_type === "fixed") {
        newAmount = Math.max(0, total - voucher.discount_value);
      }

      setFinalAmount(newAmount);
      alert(`Voucher áp dụng thành công! Tổng thanh toán: ${newAmount.toLocaleString()} VNĐ`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCheckout = async () => {
  if (!recipientName || !phone || !addressLine) {
    return alert("Vui lòng nhập đầy đủ thông tin người nhận!");
  }

  const user = JSON.parse(localStorage.getItem("user"));
if (!user || !user.id) {  // kiểm tra id
  alert("Vui lòng đăng nhập trước khi thanh toán!");
  navigate("/login");
  return;
}


  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }

  try {
    // Chuyển price sang number trước khi gửi
    const cartData = cart.map(item => ({
      ...item,
      price: Number(item.price)
    }));

    const res = await fetch("http://localhost:5000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        recipient_name: recipientName,
        phone,
        address_line: addressLine,
       cart: cartData,             // dùng cart đã chuẩn hóa
        voucher_code: voucherCode || null
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Thanh toán thành công!");
      localStorage.removeItem("cart");
      navigate(`/order-success/${data.order_id}`);
    } else {
      alert(data.error || "Lỗi khi thanh toán!");
    }
  } catch (err) {
    console.error(err);
    alert("Lỗi kết nối đến máy chủ.");
  }
};

  return (
    <div className="checkout-container">
      <h2>Thanh Toán</h2>

      <div className="checkout-cart">
        <h3>Giỏ hàng</h3>
        {cart.length === 0 ? (
          <p>Giỏ hàng trống</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Tạm tính</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toLocaleString("vi-VN")} VNĐ</td>
                  <td>{(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="checkout-total">Tổng: {total.toLocaleString("vi-VN")} VNĐ</p>
        <p className="checkout-final">Tổng thanh toán: {finalAmount.toLocaleString("vi-VN")} VNĐ</p>

        <h3>Thông tin người nhận</h3>
        <label>Họ tên:</label>
        <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} />

        <label>Số điện thoại:</label>
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} />

        <label>Địa chỉ:</label>
        <input type="text" value={addressLine} onChange={e => setAddressLine(e.target.value)} />

        <label>Mã giảm giá:</label>
        <input type="text" value={voucherCode} placeholder="Nhập mã giảm giá"
          onChange={e => setVoucherCode(e.target.value)} />
        <button onClick={handleApplyVoucher} className="apply-voucher-btn">Áp dụng</button>
      </div>

      <button className="checkout-btn" onClick={handleCheckout}>Thanh Toán</button>
    </div>
  );
}
