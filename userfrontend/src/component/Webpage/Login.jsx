import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../CSS/auth.css";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Kiểm tra nếu là admin -> Không cho login vào frontend
        if (data.user.role === "admin") {
          alert(
            "Tài khoản này là Admin. Vui lòng đăng nhập tại trang quản trị (port 3001)."
          );
          return; // Dừng lại, không lưu token, không navigate
        }

        // Nếu là user -> lưu thông tin vào localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Lưu object phải stringify

        // 🔹 Phát sự kiện thông báo cho Header cập nhật ngay lập tức
        window.dispatchEvent(new Event("userChanged"));

        alert("Đăng nhập thành công!");
        navigate("/"); // Điều hướng về trang chủ
      } else {
        alert(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Nhập tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Đăng Nhập</button>
        </form>
        <p>
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
