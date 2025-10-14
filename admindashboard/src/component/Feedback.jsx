import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/user.css"; // Dùng chung CSS bảng với Brand.jsx

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  // 📌 Lấy danh sách feedback từ API
  const fetchFeedbacks = () => {
    fetch("http://localhost:5000/api/feedback")
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // 📌 Xóa phản hồi
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phản hồi này?")) {
      fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            // alert("Xóa phản hồi thành công!");
            fetchFeedbacks();
          } else {
            console.error("Lỗi khi xóa:", res.statusText);
            alert("Có lỗi khi xóa phản hồi.");
          }
        })
        .catch((err) => {
          console.error("Lỗi khi xóa:", err);
          alert("Lỗi kết nối máy chủ.");
        });
    }
  };

  return (
    <div className="user-list">
      <h2>Danh sách Phản hồi từ người dùng</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Người gửi</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Nội dung</th>
            <th>Ngày gửi</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.length > 0 ? (
            feedbacks.map((fb) => (
              <tr key={fb.feedback_id}>
                <td>{fb.feedback_id}</td>
                <td>{fb.username || fb.name}</td>
                <td>{fb.email}</td>
                <td>{fb.phone || "—"}</td>
                <td>{fb.message}</td>
                <td>
                  {new Date(fb.created_at).toLocaleString("vi-VN", {
                    hour12: false,
                  })}
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(fb.feedback_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Không có phản hồi nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Feedback;
