// controllers/PagesController.js
const db = require("../db"); // kết nối MySQL

// Lấy tất cả trang (published)
exports.getAllPages = (req, res) => {
  const sql = "SELECT * FROM pages WHERE status = 'published' ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    res.json(results);
  });
};

// Lấy chi tiết 1 trang theo slug (ví dụ: /gioi-thieu)
exports.getPageBySlug = (req, res) => {
  const { slug } = req.params;
  const sql = "SELECT * FROM pages WHERE slug = ? AND status = 'published' LIMIT 1";
  db.query(sql, [slug], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (results.length === 0) return res.status(404).json({ error: "Page not found" });
    res.json(results[0]);
  });
};

// Thêm mới trang
exports.createPage = (req, res) => {
  const { title, slug, content, image, status } = req.body;
  const sql = "INSERT INTO pages (title, slug, content, image, status) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [title, slug, content, image || null, status || 'draft'], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    res.json({ message: "Page created successfully", page_id: result.insertId });
  });
};

// Cập nhật trang
exports.updatePage = (req, res) => {
  const { id } = req.params;
  const { title, slug, content, image, status } = req.body;
  const sql = "UPDATE pages SET title = ?, slug = ?, content = ?, image = ?, status = ? WHERE page_id = ?";
  db.query(sql, [title, slug, content, image || null, status || 'draft', id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Page not found" });
    res.json({ message: "Page updated successfully" });
  });
};

// Xóa trang
exports.deletePage = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM pages WHERE page_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Page not found" });
    res.json({ message: "Page deleted successfully" });
  });
};
