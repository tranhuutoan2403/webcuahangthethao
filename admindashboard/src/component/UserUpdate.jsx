import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../CSS/productupdate.css"
export default function UserUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [phone, setphone] = useState("");
  const [address, setaddress] = useState("");
  
  // Lấy dữ liệu ban đầu
  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setusername(data.username);
        setemail(data.email);
        setpassword(data.password);
        setphone(data.phone);
        setaddress(data.address);
        
      });
  }, [id]);

  const handleUpdate = () => {
    fetch(`http://localhost:5000/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, phone, address })
    })
      .then(res => res.json())
      .then(() => {
        alert("Cập nhật thành công");
        navigate("/users"); // quay lại danh sách
      });
  };
  return (
    <div className="update-form-container">
      <h2>Cập nhật người dùng</h2>
      <div>
        <label>Tên:</label>
        <input type="text" name="username" value={username} onChange={e => setusername(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={email} onChange={e => setemail(e.target.value)} />
      </div>
      <div>
        <label>Mật Khẩu:</label>
        <input type="password" name="password" value={password} onChange={e => setpassword(e.target.value)} />
      </div>
      <div>
        <label>Điện Thoại:</label>
        <input type="number" name="phone" value={phone} onChange={e => setphone(e.target.value)} />
      </div>
      <div>
        <label>Địa Chỉ:</label>
        <input type="text" name="address" value={address} onChange={e => setaddress(e.target.value)} />
      </div>
      <button onClick={handleUpdate}>Lưu</button>
    </div>
  );
}
