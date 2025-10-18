// Controllers/CategoryControllers.js
const db = require('../db');

// ✅ Lấy tất cả loại sản phẩm
exports.getAllCategories = (req, res) => {
  const sql = `SELECT category_id, name, slug FROM categories`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ✅ Lấy 1 category theo ID
exports.getCategoryById = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT category_id, name, slug FROM categories WHERE category_id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Không tìm thấy loại sản phẩm" });
    res.json(results[0]);
  });
};

// ✅ Lấy category theo slug
exports.getCategoryBySlug = (req, res) => {
  const { slug } = req.params;
  const sql = "SELECT * FROM categories WHERE slug = ? LIMIT 1";
  db.query(sql, [slug], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    if (results.length === 0)
      return res.status(404).json({ message: "Không tìm thấy loại sản phẩm" });
    res.json(results[0]);
  });
};

// ✅ Thêm loại sản phẩm mới
exports.createCategory = (req, res) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin!" });
  }

  const sql = `INSERT INTO categories (name, slug) VALUES (?, ?)`;
  db.query(sql, [name, slug], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Thêm loại sản phẩm thành công", id: result.insertId });
  });
};

// ✅ Xóa loại sản phẩm
exports.deleteCategory = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM categories WHERE category_id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Xóa loại sản phẩm thành công" });
  });
};

// ✅ Cập nhật loại sản phẩm
exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { name, slug } = req.body;

  const sql = `UPDATE categories SET name = ?, slug = ? WHERE category_id = ?`;
  db.query(sql, [name, slug, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cập nhật loại sản phẩm thành công" });
  });
};
