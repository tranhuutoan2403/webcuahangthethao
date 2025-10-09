import React, { useEffect, useState } from "react";
import "../CSS/about.css";
const AboutUs = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const slug = "ve-chung-toi";
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/news/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi fetch dữ liệu");
        return res.json();
      })
      .then((data) => {
        setAbout(data); // API trả về object
      })
      .catch((err) => {
        console.error(err);
        setError("Không thể tải dữ liệu");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Đang tải nội dung...</p>;
  if (error) return <p>{error}</p>;
  if (!about) return <p>Không tìm thấy bài viết.</p>;

  return (
    <div className="about-container">
      <div className="about-card">
        <h2 className="about-title">{about.title}</h2>
        <p className="about-content">{about.content}</p>
      </div>
    </div>
  );
};

export default AboutUs;
