// controllers/ProductReviewController.js
const db = require('../db');

// ==================== Lấy tất cả review ====================
exports.getAllReviews = (req, res) => {
  const sql = `
    SELECT r.*, u.username, p.name
    FROM product_reviews r
    JOIN users u ON r.user_id = u.user_id
    JOIN products p ON r.product_id = p.product_id
    ORDER BY r.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ==================== Lấy review theo ID ====================
exports.getReviewById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT r.*, u.username, p.name
    FROM product_reviews r
    JOIN users u ON r.user_id = u.user_id
    JOIN products p ON r.product_id = p.product_id
    WHERE r.review_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy review' });
    res.json(results[0]);
  });
};
// ==================== Lấy review theo product_id ====================
exports.getReviewsByProductId = (req, res) => {
  const { product_id } = req.params;
  const sql = `
    SELECT r.*, u.username
    FROM product_reviews r
    JOIN users u ON r.user_id = u.user_id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `;
  db.query(sql, [product_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
// ==================== Thêm review mới ====================
exports.createReview = (req, res) => {
  const { product_id, user_id, rating, comment } = req.body;

  if (!product_id || !user_id || !rating || !comment) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }

  const sql = `
    INSERT INTO product_reviews (product_id, user_id, rating, comment, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  db.query(sql, [product_id, user_id, rating, comment], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Thêm review thành công', id: result.insertId });
  });
};

// ==================== Cập nhật review ====================
exports.updateReview = (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const sqlGet = "SELECT * FROM product_reviews WHERE review_id = ?";
  db.query(sqlGet, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Review không tồn tại" });

    const current = results[0];

    const updatedData = {
      rating: rating || current.rating,
      comment: comment || current.comment
    };

    const sqlUpdate = `
      UPDATE product_reviews 
      SET rating = ?, comment = ?
      WHERE review_id = ?
    `;
    db.query(sqlUpdate, [updatedData.rating, updatedData.comment, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Cập nhật review thành công" });
    });
  });
};

// ==================== Xóa review ====================
exports.deleteReview = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM product_reviews WHERE review_id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Xóa review thành công' });
  });
};
