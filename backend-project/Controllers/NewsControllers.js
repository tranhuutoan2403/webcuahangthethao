const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==================== TẠO FOLDER LƯU ẢNH ====================
const uploadFolder = path.join(__dirname, "../public/images/news");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

// ==================== MULTER CONFIG ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, file.originalname), // giữ tên gốc file
});
const upload = multer({ storage });

// Middleware upload ảnh
const uploadImage = upload.single("image");

// ==================== CONTROLLERS ====================

// ==================== LẤY TẤT CẢ NEWS ====================
const getAllNews = (req, res) => {
  const sql = "SELECT * FROM news ORDER BY news_id ASC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách news:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    res.json(results);
  });
};

// ==================== LẤY NEWS THEO ID ====================
const getNewsById = (req, res) => {
  const sql = "SELECT * FROM news WHERE news_id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy chi tiết news:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    if (!results.length) {
      return res.status(404).json({ message: "Không tìm thấy tin tức" });
    }
    res.json(results[0]);
  });
};

// ==================== LẤY 4 BÀI VIẾT MỚI NHẤT THEO published_at ====================
const getLatestPublishedNews = (req, res) => {
  const sql = `
    SELECT news_id, title, slug, image, content, published_at
    FROM news
    WHERE status = 'published'
    ORDER BY published_at DESC
    LIMIT 4
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy tin tức mới nhất:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    res.json(results);
  });
};

// ==================== TẠO NEWS MỚI ====================
const createNews = (req, res) => {
  const { title, slug, content, status, published_at, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!category_id) {
    return res.status(400).json({ message: "category_id là bắt buộc" });
  }

  const sql = `
    INSERT INTO news (category_id, title, slug, content, image, status, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    category_id,
    title,
    slug,
    content,
    image,
    status || "draft",
    published_at || null,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm news:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    res.status(201).json({
      message: "Thêm tin tức thành công",
      news_id: result.insertId,
    });
  });
};

// ==================== CẬP NHẬT NEWS ====================
const updateNews = (req, res) => {
  const { title, slug, content, status, published_at, category_id } = req.body;
  const image = req.file ? req.file.filename : req.body.image || null;

  const sql = `
    UPDATE news
    SET category_id=?, title=?, slug=?, content=?, image=?, status=?, published_at=?
    WHERE news_id=?
  `;
  const values = [
    category_id,
    title,
    slug,
    content,
    image,
    status || "draft",
    published_at || null,
    req.params.id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật news:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    if (!result.affectedRows) {
      return res.status(404).json({ message: "Không tìm thấy tin tức" });
    }
    res.json({ message: "Cập nhật tin tức thành công" });
  });
};

// ==================== XÓA NEWS ====================
const deleteNews = (req, res) => {
  const sql = "DELETE FROM news WHERE news_id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa news:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    if (!result.affectedRows) {
      return res.status(404).json({ message: "Không tìm thấy tin tức" });
    }
    res.json({ message: "Xóa tin tức thành công" });
  });
};
// Lấy danh sách bài viết theo slug danh mục
const getNewsByCategorySlug = (req, res) => {
  const { slug } = req.params; // slug của danh mục

  const sql = `
    SELECT n.news_id, n.title, n.slug, n.image, n.content, n.published_at, nc.name AS category_name, nc.slug AS category_slug
    FROM news n
    JOIN news_categories nc ON n.category_id = nc.category_id
    WHERE nc.slug = ? AND n.status = 'published'
    ORDER BY n.published_at DESC
  `;

  db.query(sql, [slug], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};
// Lấy 1 bài viết theo slug bài viết
const getNewsBySlug = (req, res) => {
  const { slug } = req.params; // slug của bài viết

  const sql = `
    SELECT n.news_id, n.title, n.slug, n.image, n.content, n.published_at, 
           nc.name AS category_name, nc.slug AS category_slug
    FROM news n
    JOIN news_categories nc ON n.category_id = nc.category_id
    WHERE n.slug = ? AND n.status = 'published'
    LIMIT 1
  `;

  db.query(sql, [slug], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!result.length) return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json(result[0]);
  });
};

// Lấy 4 bài viết mới nhất tính bằng cột created_at


module.exports = {
  uploadImage,
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getNewsByCategorySlug,
  getNewsBySlug,
  getLatestPublishedNews,
};
