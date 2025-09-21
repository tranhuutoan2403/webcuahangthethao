import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/productupdate.css";

function UserAdd() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "admin",
  });

  const [errors, setErrors] = useState({}); // Lưu lỗi cho từng input
  const navigate = useNavigate();

  // ===============================
  // HÀM KIỂM TRA TỪNG TRƯỜNG NGAY KHI NHẬP
  // ===============================
  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "username":
        if (!value.trim()) {
          errorMsg = "Tên đăng nhập không được để trống.";
        } else if (value.length < 8) {
          errorMsg = "Tên đăng nhập phải có ít nhất 8 ký tự.";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          errorMsg = "Email không được để trống.";
        } else if (!emailRegex.test(value)) {
          errorMsg = "Email không hợp lệ.";
        }
        break;

      case "password":
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!value.trim()) {
          errorMsg = "Mật khẩu không được để trống.";
        } else if (!passwordRegex.test(value)) {
          errorMsg =
            "Mật khẩu tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.";
        }
        break;

      case "phone":
        const phoneRegex = /^\d{10,12}$/;
        if (!value.trim()) {
          errorMsg = "Số điện thoại không được để trống.";
        } else if (!phoneRegex.test(value)) {
          errorMsg = "Số điện thoại phải từ 10 đến 12 số.";
        }
        break;

      case "address":
        if (!value.trim()) {
          errorMsg = "Địa chỉ không được để trống.";
        }
        break;

      default:
        break;
    }

    return errorMsg;
  };

  // ===============================
  // XỬ LÝ THAY ĐỔI INPUT
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cập nhật dữ liệu
    setFormData({ ...formData, [name]: value });

    // Kiểm tra và cập nhật lỗi ngay lập tức
    const errorMsg = validateField(name, value);
    setErrors({ ...errors, [name]: errorMsg });
  };

  // ===============================
  // KIỂM TRA TOÀN BỘ FORM KHI SUBMIT
  // ===============================
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) newErrors[field] = errorMsg;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===============================
  // GỬI DỮ LIỆU LÊN API
  // ===============================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Nếu form còn lỗi thì không gửi request
    }

    fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Thêm user thất bại!");
        }
        return res.json();
      })
      .then(() => {
        // alert("Thêm user thành công!");
        setTimeout(() => {
          navigate("/users");
        }, 1000);
      })
      .catch((err) => {
        console.error("Lỗi khi thêm user:", err);
        alert("Có lỗi xảy ra khi thêm user.");
      });
  };

  return (
    <div className="update-form-container">
      <h2>Thêm User</h2>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <label>Tên Đăng Nhập</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Nhập tên đăng nhập"
          required
        />
        {errors.username && <p className="error">{errors.username}</p>}

        {/* Email */}
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Nhập email"
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        {/* Password */}
        <label>Mật Khẩu</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Nhập mật khẩu"
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}

        {/* Phone */}
        <label>Số Điện Thoại</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Nhập số điện thoại"
          required
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        {/* Address */}
        <label>Địa Chỉ</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Nhập địa chỉ"
          required
        />
        {errors.address && <p className="error">{errors.address}</p>}

        {/* Role */}
        <label>Vai trò:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Thêm</button>
      </form>
    </div>
  );
}

export default UserAdd;
