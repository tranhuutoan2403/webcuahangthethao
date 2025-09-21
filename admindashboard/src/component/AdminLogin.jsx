import React, { useState } from "react";
import "../CSS/adminAuth.css"; // File CSS riêng cho trang admin
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(""); // Thông báo lỗi
  const navigate = useNavigate();

  // Xử lý khi người dùng nhập vào input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Reset lỗi khi người dùng gõ lại
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Kiểm tra quyền admin
        if (data.user.role !== "admin") {
          setError("Tài khoản này không có quyền Admin!");
          return;
        }

        // Lưu token và thông tin admin vào localStorage
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", JSON.stringify(data.user));

        // Chuyển sang trang dashboard admin
        navigate("/");
      } else {
        // Sai username hoặc password
        setError(data.message || "Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              placeholder="Nhập tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Hiển thị thông báo lỗi màu đỏ */}
          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="admin-login-btn">
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
