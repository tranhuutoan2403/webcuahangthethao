import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../CSS/productupdate.css";

export default function UserUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [phone, setphone] = useState("");
  const [address, setaddress] = useState("");

  // Lấy dữ liệu user ban đầu
  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Không thể tải dữ liệu user!");
        }
        return res.json();
      })
      .then(data => {
        setusername(data.username || "");
        setemail(data.email || "");
        setpassword(data.password || "");
        setphone(data.phone || "");
        setaddress(data.address || "");
      })
      .catch(err => {
        console.error(err);
        // alert("Lỗi khi tải dữ liệu user.");
        navigate("/users");
      });
  }, [id, navigate]);

  // Xử lý cập nhật user
  const handleUpdate = () => {
    fetch(`http://localhost:5000/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify({ username, email, password, phone, address }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Cập nhật thất bại!");
        return res.json();
      })
      .then(() => {
        navigate("/users");
      })
      .catch(err => {
        console.error(err);
        // alert("Có lỗi xảy ra khi cập nhật người dùng.");
      });
  };

  return (
    <div className="update-form-container">
      <h2>Cập nhật người dùng</h2>
      <div>
        <label>Tên:</label>
        <input type="text" value={username} onChange={e => setusername(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={e => setemail(e.target.value)} />
      </div>
      <div>
        <label>Mật khẩu:</label>
        <input type="password" value={password} onChange={e => setpassword(e.target.value)} />
      </div>
      <div>
        <label>Điện thoại:</label>
        <input type="number" value={phone} onChange={e => setphone(e.target.value)} />
      </div>
      <div>
        <label>Địa chỉ:</label>
        <input type="text" value={address} onChange={e => setaddress(e.target.value)} />
      </div>
      <button onClick={handleUpdate}>Lưu</button>
    </div>
  );
}
