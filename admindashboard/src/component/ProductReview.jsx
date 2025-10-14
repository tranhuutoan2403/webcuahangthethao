// ProductReview.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/user.css"; // dùng chung CSS bảng

const ProductReview = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  // ===== Lấy danh sách đánh giá sản phẩm =====
  const fetchReviews = () => {
    fetch("http://localhost:5000/api/product-review")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ===== Xóa đánh giá =====
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
      fetch(`http://localhost:5000/api/product-review/${id}`, { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            fetchReviews(); // tải lại danh sách
          } else {
            console.error("Lỗi khi xóa:", res.statusText);
            alert("Có lỗi khi xóa đánh giá.");
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

      <h2>Danh sách Đánh Giá Sản Phẩm</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên người dùng</th>
            <th>Tên sản phẩm</th>
            <th>Số sao</th>
            <th>Bình luận</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <tr key={review.review_id}>
                <td>{review.review_id}</td>
                <td>{review.username}</td>
                <td>{review.name}</td>
                <td>{review.rating} ⭐</td>
                <td>{review.comment}</td>
                <td>
                  {new Date(review.created_at).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td>
                  {/* <button
                    className="edit-btn"
                    onClick={() => navigate(`/reviews/update/${review.review_id}`)}
                  >
                    Sửa
                  </button> */}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(review.review_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Không có đánh giá nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductReview;
