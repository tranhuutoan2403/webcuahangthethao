import React, { useEffect, useState } from "react";
import "../CSS/profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState(""); // lỗi live

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });

    // Live validation chỉ áp dụng cho newPassword
    if (name === "newPassword") {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{8,}$/;
      if (!regex.test(value)) {
        setPasswordError(
          "Mật khẩu phải từ 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt"
        );
      } else {
        setPasswordError("");
      }
    }

    // Live check confirmPassword
    if (name === "confirmPassword") {
      if (value !== passwordData.newPassword) {
        setPasswordError("Mật khẩu xác nhận không khớp");
      } else {
        setPasswordError("");
      }
    }

    if (name === "newPassword" && passwordData.confirmPassword !== "") {
      if (passwordData.confirmPassword !== value) {
        setPasswordError("Mật khẩu xác nhận không khớp");
      } else {
        setPasswordError("");
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordError) return; // không gửi nếu có lỗi

    try {
      const response = await fetch(`http://localhost:5000/api/users/change-password/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Đổi mật khẩu thành công!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setShowModal(false), 1500);
      } else {
        setMessage(data.error || "Đổi mật khẩu thất bại.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Lỗi kết nối đến server.");
    }
  };

  if (!user) return <p>Bạn chưa đăng nhập!</p>;

  return (
    <div className="profile-container">
      <h2>Thông Tin Cá Nhân</h2>
      <p><strong>Tên đăng nhập:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Vai trò:</strong> {user.role}</p>

      <button className="btn-update" onClick={() => setShowModal(true)}>
        Cập nhật thông tin
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h3>Đổi Mật Khẩu</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu mới:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu mới:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {passwordError && <p className="message">{passwordError}</p>}
              {message && <p className="message">{message}</p>}

              <div className="modal-actions">
                <button type="submit" className="btn-update">Lưu thay đổi</button>
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
