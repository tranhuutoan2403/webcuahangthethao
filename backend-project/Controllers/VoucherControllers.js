const db = require('../db'); // file kết nối database

// Lấy tất cả voucher
exports.getAllVouchers = (req, res) => {
  db.query("SELECT * FROM voucher", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Lấy voucher theo code (dùng cho áp mã giảm giá)
exports.getVoucherByCode = (req, res) => {
  const { code } = req.params;
  const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd

  const sql = `
    SELECT *
    FROM voucher
    WHERE code = ?
      AND status = 'active'
      AND (start_date IS NULL OR start_date <= ?)
      AND (end_date IS NULL OR end_date >= ?)
      AND used_count < usage_limit
    LIMIT 1
  `;

  db.query(sql, [code, today, today], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Mã giảm giá không hợp lệ hoặc hết hạn" });
    res.json(results[0]);
  });
};

// Tạo voucher mới
exports.createVoucher = (req, res) => {
  const {
    code,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    usage_limit,
    start_date,
    end_date,
    status
  } = req.body;

  const sql = `
    INSERT INTO voucher
    (code, description, discount_type, discount_value, min_order_amount, usage_limit, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [code, description, discount_type, discount_value, min_order_amount, usage_limit, start_date, end_date, status || 'active'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Tạo voucher thành công", voucherId: result.insertId });
  });
};

// Cập nhật voucher
exports.updateVoucher = (req, res) => {
  const { id } = req.params;
  const {
    code,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    usage_limit,
    start_date,
    end_date,
    status
  } = req.body;

  const sql = `
    UPDATE voucher
    SET code=?, description=?, discount_type=?, discount_value=?, min_order_amount=?, usage_limit=?, start_date=?, end_date=?, status=?
    WHERE voucher_id=?
  `;

  db.query(sql, [code, description, discount_type, discount_value, min_order_amount, usage_limit, start_date, end_date, status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cập nhật voucher thành công" });
  });
};

// Xóa voucher
exports.deleteVoucher = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM voucher WHERE voucher_id=?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Xóa voucher thành công" });
  });
};
