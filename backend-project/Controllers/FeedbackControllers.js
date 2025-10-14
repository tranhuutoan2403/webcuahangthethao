const db = require("../db");

// =============================
// 📌 Lấy tất cả feedback
// =============================
exports.getAllFeedback = (req, res) => {
  const sql = `
    SELECT f.*, u.username
    FROM feedback f
    JOIN users u ON f.user_id = u.user_id
    ORDER BY f.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// =============================
// 📌 Lấy 1 feedback theo ID
// =============================
exports.getFeedbackById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT f.*, u.username
    FROM feedback f
    JOIN users u ON f.user_id = u.user_id
    WHERE f.feedback_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy phản hồi" });
    res.json(results[0]);
  });
};

// =============================
// 📌 Thêm feedback mới
// =============================
exports.createFeedback = (req, res) => {
  const { user_id, name, email, phone, message } = req.body;

  if (!user_id || !name || !email || !message) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin bắt buộc." });
  }

  const sql = `
    INSERT INTO feedback (user_id, name, email, phone, message)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [user_id, name, email, phone, message], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Gửi phản hồi thành công!", feedback_id: result.insertId });
  });
};

// =============================
// 📌 Cập nhật feedback (nếu cần)
// =============================
exports.updateFeedback = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, message } = req.body;

  const sql = `
    UPDATE feedback 
    SET name = ?, email = ?, phone = ?, message = ?
    WHERE feedback_id = ?
  `;
  db.query(sql, [name, email, phone, message, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy phản hồi" });
    res.json({ message: "Cập nhật phản hồi thành công" });
  });
};

// =============================
// 📌 Xóa feedback
// =============================
exports.deleteFeedback = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM feedback WHERE feedback_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy phản hồi" });
    res.json({ message: "Xóa phản hồi thành công" });
  });
};
