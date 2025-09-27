import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return <p>Bạn chưa đăng nhập!</p>;

  return (
    <div className="profile-page">
      <h2>Thông Tin Cá Nhân</h2>
      <div className="profile-info">
        <p><strong>Tên đăng nhập:</strong> {user.username}</p>
        {/* <p><strong>Email:</strong> {user.email}</p> */}
        <p><strong>Số điện thoại:</strong> {user.phone }</p>
        <p><strong>Địa chỉ:</strong> {user.address }</p>
      </div>

      <div className="profile-actions">
        <button
          className="btn-update"
          onClick={() => navigate("/profile/update")}
        >
          Cập nhật thông tin
        </button>

        <button
          className="btn-change-password"
          onClick={() => navigate("/profile/change-password")}
        >
          Đổi mật khẩu
        </button>
      </div>
    </div>
  );
}
