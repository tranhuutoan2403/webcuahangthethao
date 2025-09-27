import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../CSS/auth.css"; // ✅ Đặt ở đầu để CSS được load

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Hàm validate từng field riêng
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "username":
        if (!value.trim()) {
          error = "Tên đăng nhập không được để trống";
        } else if (value.length < 8) {
          error = "Tên đăng nhập phải có ít nhất 8 ký tự";
        }
        break;

      case "password":
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!value.trim()) {
          error = "Mật khẩu không được để trống";
        } else if (!passwordRegex.test(value)) {
          error =
            "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
        }
        break;

      case "phone":
        const phoneRegex = /^[0-9]{10,12}$/;
        if (!value.trim()) {
          error = "Số điện thoại không được để trống";
        } else if (!phoneRegex.test(value)) {
          error = "Số điện thoại phải từ 10 đến 12 số";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email không được để trống";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email không hợp lệ";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Xử lý khi thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // ✅ Kiểm tra lỗi ngay lập tức
    validateField(name, value);
  };

  // Kiểm tra toàn bộ form khi submit
  const validateForm = () => {
    const fields = ["username", "password", "phone", "email"];
    let isValid = true;

    fields.forEach((field) => {
      validateField(field, formData[field]);
      if (errors[field]) isValid = false;
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // ❌ Không gửi nếu còn lỗi

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Đăng ký thành công!");
        navigate("/login");
      } else {
        // alert(data.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Đăng Ký</h2>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <p className="error-text">{errors.username}</p>}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          {/* Phone */}
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}

          {/* Address */}
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={formData.address}
            onChange={handleChange}
          />

          <button type="submit">Đăng Ký</button>
        </form>
        <p>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
