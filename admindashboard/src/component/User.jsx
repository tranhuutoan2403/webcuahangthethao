import React, { useEffect, useState } from "react";
import "../CSS/user.css"
function User() {
  const [users, setUsers] = useState([]);

// Hàm để lấy danh sách user từ API
// Hàm fetch danh sách user
const fetchUsers = () => {
  fetch("http://localhost:5000/api/users")
    .then((res) => res.json())
    .then((data) => {
      // Lọc chỉ user có status = 'active'
      const activeUsers = data.filter(user => user.status === 'active');
      setUsers(activeUsers);
    })
    .catch((err) => console.error("Lỗi khi tải user:", err));
};

  // Lấy danh sách users ban đầu khi component được render
  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm xóa user
  const handleDelete = (id) => {
   if (window.confirm("Bạn có chắc muốn ẩn user này?")) {
    fetch(`http://localhost:5000/api/users/hide/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    })
        .then((res) => {
          if (res.ok) {
            alert("Xóa thành công!");
            // Gọi lại hàm fetchUsers để cập nhật danh sách
            fetchUsers(); 
          } else {
            console.error("Lỗi khi xóa:", res.statusText);
            alert("Có lỗi xảy ra khi xóa user.");
          }
        })
        .catch((err) => {
          console.error("Lỗi khi xóa:", err);
          alert("Có lỗi khi kết nối đến máy chủ.");
        });
    }
  };

  return (
    <div className="user-list">
       <button
          className="edit-btn"
          onClick={() => (window.location.href = `/users/add/`)}
        >
          Thêm
        </button>
      <h2>Danh sách Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.user_id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  
                  <button
                    className="edit-btn"
                    onClick={() => (window.location.href = `/users/update/${user.user_id}`)}
                  >
                    Sửa
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user.user_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Không có user nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default User;
