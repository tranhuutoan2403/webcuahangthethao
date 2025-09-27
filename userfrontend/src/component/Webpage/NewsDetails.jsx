import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../CSS/newsdetail.css";

const NewsDetail = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    fetch(`http://localhost:5000/api/news/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy bài viết");
        return res.json();
      })
      .then((data) => setNews(data))
      .catch((err) => {
        console.error(err);
        setError("Không thể tải bài viết");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Đang tải bài viết...</p>;
  if (error) return <p>{error}</p>;
  if (!news) return <p>Không tìm thấy bài viết.</p>;

  return (
    <div className="news-detail-container">
      <h1 className="news-detail-title">{news.title}</h1>
      {news.image && (
        <img
          src={`http://localhost:5000/images/news/${news.image}`}
          alt={news.title}
          className="news-detail-image"
        />
      )}
      <p className="news-detail-meta">
        Ngày xuất bản:{" "}
        {news.published_at
          ? new Date(news.published_at).toLocaleDateString()
          : "Chưa có"}
      </p>
      <div className="news-detail-content">{news.content}</div>
    </div>
  );
};

export default NewsDetail;
