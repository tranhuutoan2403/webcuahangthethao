import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../CSS/auth.css";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(""); // Lưu thông báo lỗi từ server
  const navigate = useNavigate();

  // Khi người dùng nhập, reset lỗi
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Xóa lỗi khi người dùng nhập lại
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
        // Nếu là admin nhưng đăng nhập ở frontend
        if (data.user.role === "admin") {
          setError(
            "Tài khoản này là Admin. Vui lòng đăng nhập ở trang quản trị!"
          );
          return;
        }

        // Nếu là user hợp lệ -> lưu token và thông tin user
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Cập nhật header ngay lập tức
        window.dispatchEvent(new Event("userChanged"));

        navigate("/"); // Điều hướng về trang chủ
      } else {
        // Nếu sai username hoặc password
        setError(data.message || "Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại!");
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

          {/* Thông báo lỗi từ server */}
          {error && <p className="error-text">{error}</p>}

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
