import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/profile.css";

export default function ProfileUpdate() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    password: "", // 👈 thêm password vào đây
  });

  const [message, setMessage] = useState("");

  // ====== Load user từ localStorage ======
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      setFormData({
        username: parsedUser.username || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        address: parsedUser.address || "",
        role: parsedUser.role || "user",
        password: parsedUser.password || "", // 👈 giữ password hiện tại
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // ====== Xử lý thay đổi input ======
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ====== Gửi dữ liệu update ======
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.phone.trim() || !formData.address.trim()) {
      setMessage("Vui lòng nhập đầy đủ số điện thoại và địa chỉ!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData), // 👈 gửi đầy đủ dữ liệu lên server
        }
      );

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        setMessage("Cập nhật thông tin thành công!");
        setTimeout(() => navigate("/profile"), 1500);
      } else {
        setMessage(data.error || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error(error);
      setMessage("Lỗi kết nối đến server!");
    }
  };

  if (!user) return <p>Đang tải thông tin...</p>;

  return (
    <div className="update-form-container">
      <h2>Cập Nhật Thông Tin</h2>
      <form onSubmit={handleUpdate}>
        {/* Username */}
        <div className="form-group">
          <label>Tên đăng nhập:</label>
          <input type="text" name="username" value={formData.username} disabled />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} disabled />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
            required
          />
        </div>

        {/* Role */}
        <div className="form-group">
          <label>Vai trò (Role):</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Password (ẩn, không cho chỉnh) */}
        <input type="hidden" name="password" value={formData.password} />

        {/* Thông báo */}
        {message && <p className="message">{message}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-update">Lưu thay đổi</button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/profile")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
