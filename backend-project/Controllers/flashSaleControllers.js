const db = require("../db");

// Lấy tất cả flash sale
exports.getAllFlashSales = (req, res) => {
  const sql = "SELECT * FROM flash_sales ORDER BY start_at ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Lấy flash sale đang active cùng danh sách sản phẩm
exports.getActiveFlashSaleWithProducts = (req, res) => {
  const now = new Date();
  const sql = `
  SELECT fs.*, p.product_id, p.name, p.slug, p.price, p.image
  FROM flash_sales fs
  JOIN flash_sale_products fsp ON fs.flash_sale_id = fsp.flash_sale_id
  JOIN products p ON fsp.product_id = p.product_id
  WHERE fs.status = 'active'
    AND fs.start_at <= NOW()
    AND fs.end_at >= NOW()
  ORDER BY fs.start_at DESC
`;
  db.query(sql, [now, now], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Nhóm sản phẩm theo flash_sale_id
    const flashSales = {};
    results.forEach(row => {
      const id = row.flash_sale_id;
      if (!flashSales[id]) {
        flashSales[id] = {
          flash_sale_id: id,
          name: row.name,
          discount_type: row.discount_type,
          discount_value: row.discount_value,
          start_at: row.start_at,
          end_at: row.end_at,
          products: []
        };
      }

      // Tính giá sale dựa trên flash_sales discount
      let salePrice = row.price;
      if (row.discount_type === "percent") {
        salePrice = Math.round(row.price * (100 - row.discount_value) / 100);
      } else if (row.discount_type === "fixed") {
        salePrice = row.price - row.discount_value;
      }

      flashSales[id].products.push({
        product_id: row.product_id,
        name: row.name,
        slug: row.slug,
        price: row.price,
        sale_price: salePrice,
        image: row.image
      });
    });

    res.json(Object.values(flashSales));
  });
};

// Tạo flash sale mới
exports.createFlashSale = (req, res) => {
  const { name, description, discount_type, discount_value, start_at, end_at } = req.body;
  const sql = `
    INSERT INTO flash_sales (name, description, discount_type, discount_value, start_at, end_at, status)
    VALUES (?, ?, ?, ?, ?, ?, 'scheduled')
  `;
  db.query(sql, [name, description, discount_type, discount_value, start_at, end_at], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Flash sale created", flash_sale_id: result.insertId });
  });
};

// Thêm sản phẩm vào flash sale
exports.addProductToFlashSale = (req, res) => {
  const flash_sale_id = req.params.id;
  const { product_id, stock_limit } = req.body;

  const sql = `
    INSERT INTO flash_sale_products (flash_sale_id, product_id, stock_limit)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [flash_sale_id, product_id, stock_limit], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product added to flash sale", id: result.insertId });
  });
};

// Xóa sản phẩm khỏi flash sale
exports.removeProductFromFlashSale = (req, res) => {
  const { flashSaleId, productId } = req.params;
  const sql = `
    DELETE FROM flash_sale_products WHERE flash_sale_id = ? AND product_id = ?
  `;
  db.query(sql, [flashSaleId, productId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product removed from flash sale" });
  });
};
// Lấy flash sale theo id
exports.getFlashSaleById = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM flash_sales WHERE flash_sale_id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Không tìm thấy flash sale" });
    res.json(results[0]);
  });
};
// Cập nhật flash sale (status, discount, thời gian)
exports.updateFlashSale = (req, res) => {
  const { id } = req.params;
  const { name, description, discount_type, discount_value, start_at, end_at, status } = req.body;

  const sql = `
    UPDATE flash_sales
    SET name = ?, description = ?, discount_type = ?, discount_value = ?, start_at = ?, end_at = ?, status = ?
    WHERE flash_sale_id = ?
  `;
  db.query(sql, [name, description, discount_type, discount_value, start_at, end_at, status, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Flash sale updated" });
  });
};

// Xóa flash sale
exports.deleteFlashSale = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM flash_sales WHERE flash_sale_id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Flash sale deleted" });
  });
};
