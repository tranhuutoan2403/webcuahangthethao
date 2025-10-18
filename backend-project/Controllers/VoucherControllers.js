const db = require('../db'); // file kết nối database

// Lấy tất cả voucher kèm tên danh mục
exports.getAllVouchers = (req, res) => {
  const sql = `
    SELECT v.voucher_id, v.code, v.description, v.discount_type, v.discount_value,
           v.min_order_amount, v.usage_limit, v.used_count, v.start_date, v.end_date,
           v.status, v.created_at,
           c.name AS category_name
    FROM voucher v
    LEFT JOIN categories c ON v.category_id = c.category_id
    ORDER BY v.voucher_id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};


// Lấy voucher theo code (dùng cho áp mã giảm giá)
exports.getVoucherByCode = (req, res) => {
  const { code } = req.params;
  const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  const { category_id } = req.query; // optional: kiểm tra danh mục

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

    const voucher = results[0];

    // Kiểm tra category_id nếu gửi lên
    if (category_id && voucher.category_id !== Number(category_id)) {
      return res.status(400).json({ message: "Voucher không áp dụng cho danh mục này" });
    }

    res.json(voucher);
  });
};

// Lấy voucher theo id
exports.getVoucherById = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM voucher WHERE voucher_id = ? LIMIT 1`;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy voucher" });
    res.json(results[0]);
  });
};

// Tạo voucher mới
exports.createVoucher = (req, res) => {
  const {
    category_id,
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
    (category_id, code, description, discount_type, discount_value, min_order_amount, usage_limit, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [category_id, code, description, discount_type, discount_value, min_order_amount, usage_limit, start_date, end_date, status || 'active'],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Tạo voucher thành công", voucherId: result.insertId });
    }
  );
};

// Cập nhật voucher
exports.updateVoucher = (req, res) => {
  const { id } = req.params;
  const {
    category_id,
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
    SET category_id=?, code=?, description=?, discount_type=?, discount_value=?, min_order_amount=?, usage_limit=?, start_date=?, end_date=?, status=?
    WHERE voucher_id=?
  `;

  db.query(
    sql,
    [category_id, code, description, discount_type, discount_value, min_order_amount, usage_limit, start_date, end_date, status, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Cập nhật voucher thành công" });
    }
  );
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
