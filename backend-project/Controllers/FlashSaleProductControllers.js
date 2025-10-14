const db = require("../db");

// Lấy tất cả flash sale product
exports.getAllFlashSaleProducts = (req, res) => {
  const sql = `
    SELECT fsp.*, 
           p.name, 
           fs.name AS flash_sale_name
    FROM flash_sale_products fsp
    JOIN products p ON fsp.product_id = p.product_id
    JOIN flash_sales fs ON fsp.flash_sale_id = fs.flash_sale_id
    ORDER BY fsp.created_at ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
// Lấy 1 flash sale product theo id
exports.getFlashSaleProductById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT fsp.*, 
           p.name, 
           fs.name AS flash_sale_name
    FROM flash_sale_products fsp
    JOIN products p ON fsp.product_id = p.product_id
    JOIN flash_sales fs ON fsp.flash_sale_id = fs.flash_sale_id
    WHERE fsp.id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy sản phẩm flash sale" });
    res.json(results[0]);
  });
};


// Thêm flash sale product mới
exports.createFlashSaleProduct = (req, res) => {
  const { flash_sale_id, product_id, stock_limit } = req.body;
  const sql = `
    INSERT INTO flash_sale_products 
    (flash_sale_id, product_id, stock_limit)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [flash_sale_id, product_id,stock_limit], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Thêm flash sale product thành công", id: result.insertId });
  });
};

// Cập nhật flash sale product
exports.updateFlashSaleProduct = (req, res) => {
  const { id } = req.params;
  const { flash_sale_id, product_id, stock_limit } = req.body;
  const sql = `
    UPDATE flash_sale_products 
    SET flash_sale_id = ?, product_id = ?, stock_limit = ? 
    WHERE id = ?
  `;
  db.query(sql, [flash_sale_id, product_id, stock_limit, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cập nhật flash sale product thành công" });
  });
};

// Xóa flash sale product
exports.deleteFlashSaleProduct = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM flash_sale_products WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Xóa flash sale product thành công" });
  });
};
