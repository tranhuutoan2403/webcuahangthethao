import React, { useEffect, useState } from "react";
import "../CSS/user.css";

const NewsAdmin = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/news")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setNewsList(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Lỗi khi lấy news:", err);
        setError("Không thể tải dữ liệu");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tin tức này?")) return;

    fetch(`http://localhost:5000/api/news/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Xóa thất bại");
        // alert("Xóa thành công");
        fetchNews();
      })
      .catch((err) => {
        console.error(err);
        // alert("Xóa thất bại");
      });
  };

  if (loading) return <p>Đang tải tin tức...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-list">
      <button
        className="edit-btn"
        onClick={() => (window.location.href = "/news/add/")}
      >
        Thêm
      </button>

      <h2>Danh sách Tin tức</h2>

      <table className="table-list">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Trạng thái</th>
            <th>Ngày xuất bản</th>
            <th>Hình ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {newsList.length > 0 ? (
            newsList.map((news) => (
              <tr key={news.news_id}>
                <td>{news.news_id}</td>
                <td>{news.title}</td>
                <td>{news.status}</td>
                <td>
                  {news.published_at
                    ? new Date(news.published_at).toLocaleDateString()
                    : "Chưa có"}
                </td>
                <td>
                  {news.image && (
                    <img width={200}
                      src={`http://localhost:5000/images/news/${news.image}`}
                      alt={news.title}
                      className="table-image"
                    />
                  )}
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      (window.location.href = `/news/update/${news.news_id}`)
                    }
                  >
                    Sửa
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(news.news_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Chưa có tin tức nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NewsAdmin;
