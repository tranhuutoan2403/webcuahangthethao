import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/changepass.css";

export default function ProfileChangePass() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Lưu lỗi riêng cho từng field
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Hàm validate riêng cho từng field
  const validateField = (name, value) => {
    let error = "";

    if (name === "currentPassword") {
      if (!value.trim()) {
        error = "Vui lòng nhập mật khẩu hiện tại.";
      }
    }

    if (name === "newPassword") {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>/?-]).{8,}$/;
      if (!regex.test(value)) {
        error =
          "Mật khẩu mới phải ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.";
      }
    }

    if (name === "confirmPassword") {
      if (value !== passwordData.newPassword) {
        error = "Mật khẩu xác nhận không khớp.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });

    // Validate ngay khi nhập
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra tất cả fields trước khi submit
    const currentPassError = validateField("currentPassword", passwordData.currentPassword);
    const newPassError = validateField("newPassword", passwordData.newPassword);
    const confirmPassError = validateField("confirmPassword", passwordData.confirmPassword);

    if (currentPassError || newPassError || confirmPassError) {
      return; // Nếu có lỗi thì không submit
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/change-password/${user.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Đổi mật khẩu thành công!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Reset lỗi sau khi đổi thành công
        setErrors({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else {
        setMessage(data.error || "Đổi mật khẩu thất bại.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Lỗi kết nối đến server.");
    }
  };

  if (!user) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="update-form-container">
      <h2>Đổi Mật Khẩu</h2>
      <form onSubmit={handleSubmit}>
        {/* Mật khẩu hiện tại */}
        <div className="form-group">
          <label>Mật khẩu hiện tại:</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handleChange}
            onBlur={(e) => validateField("currentPassword", e.target.value)}
            required
          />
          {errors.currentPassword && (
            <p className="error-text">{errors.currentPassword}</p>
          )}
        </div>

        {/* Mật khẩu mới */}
        <div className="form-group">
          <label>Mật khẩu mới:</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            onBlur={(e) => validateField("newPassword", e.target.value)}
            required
          />
          {errors.newPassword && (
            <p className="error-text">{errors.newPassword}</p>
          )}
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="form-group">
          <label>Xác nhận mật khẩu mới:</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            onBlur={(e) => validateField("confirmPassword", e.target.value)}
            required
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}
        </div>

        {message && <p className="message">{message}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-update">
            Lưu thay đổi
          </button>
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
