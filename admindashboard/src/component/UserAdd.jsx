import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/productupdate.css"
function UserAdd() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password:"",
    phone:"",
    address:"",
    role:"admin"
  });
  const navigate = useNavigate(); // dùng để điều hướng

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Thêm user thành công!");
        // Sau 1 giây tự động quay về danh sách users
        setTimeout(() => {
          navigate("/users");
        }, 1000);
      })
      .catch((err) => console.error("Lỗi khi thêm user:", err));
  };

  return (
    <div className="update-form-container">
      <h2>Thêm User</h2>
      <form onSubmit={handleSubmit}>
        <label>Tên Đăng Nhập</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Nhập tên"
          required
        />
       
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Nhập email"
          required
        />
        <label>Mật Khẩu</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Nhập tên"
          required
        />
        <label>Số Điện Thoại</label>
        <input
          type="number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Nhập tên"
          required
        />
        <label>Địa Chỉ</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Nhập tên"
          required
        />
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
