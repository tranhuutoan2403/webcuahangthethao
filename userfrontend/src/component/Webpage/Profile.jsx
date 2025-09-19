import React, { useEffect, useState } from "react";
import "../CSS/profile.css"
function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p>Bạn chưa đăng nhập!</p>;
  }

  return (
    <div className="profile-container">
      <h2>Thông Tin Cá Nhân</h2>
      <p><strong>Tên đăng nhập:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Vai trò:</strong> {user.role}</p>
   
    </div>
  );
}

export default Profile;
