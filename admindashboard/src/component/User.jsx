import React, { useEffect, useState } from "react";
import api from "../api"; // ✅ Import api.js
import "../CSS/user.css";

function User() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const usersPerPage = 5; // 5 user mỗi trang

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
        await api.put(`/users/hide/${id}`);
        fetchUsers(); // Reload lại danh sách sau khi ẩn
      } catch (err) {
        console.error("Lỗi khi ẩn user:", err.response?.data || err.message);
      }
    }
  };

  // ==== Logic phân trang ====
  const indexOfLastUser = currentPage * usersPerPage; // Vị trí user cuối cùng
  const indexOfFirstUser = indexOfLastUser - usersPerPage; // Vị trí user đầu tiên
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser); // Danh sách user hiển thị

  const totalPages = Math.ceil(users.length / usersPerPage); // Tổng số trang

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
            <th>Số điện thoại</th>
            <th>Vai Trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user.user_id}> {/* ✅ Key unique cho mỗi user */}
                <td>{user.user_id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                 <td>{user.phone}</td>
                <td>{user.role}</td>
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

      {/* ==== PHÂN TRANG ==== */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Trang trước
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? "active-page" : ""}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default User;
