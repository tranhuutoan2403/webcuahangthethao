import React, { useEffect, useState } from "react";
import api from "../api"; // ✅ Import api.js
import "../CSS/user.css";

function User() {
  const [users, setUsers] = useState([]);

  // Hàm lấy danh sách user từ API
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users"); // ✅ Token tự động đính vào headers
      const activeUsers = res.data.filter((user) => user.status === "active");
      setUsers(activeUsers);
    } catch (err) {
      console.error("Lỗi khi tải user:", err.response?.data || err.message);
    }
  };

  // Gọi fetchUsers khi component render lần đầu
  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm ẩn user (status = hidden)
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn ẩn user này?")) {
      try {
        await api.put(`/users/hide/${id}`); // ✅ Không cần headers thủ công
        alert("Ẩn user thành công!");
        fetchUsers(); // Reload lại danh sách sau khi ẩn
      } catch (err) {
        console.error("Lỗi khi ẩn user:", err.response?.data || err.message);
        alert("Có lỗi xảy ra khi ẩn user.");
      }
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
              <tr key={user.user_id}> {/* ✅ Fix warning unique key */}
                <td>{user.user_id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      (window.location.href = `/users/update/${user.user_id}`)
                    }
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
