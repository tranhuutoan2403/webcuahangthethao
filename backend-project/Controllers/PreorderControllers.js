const db = require("../db");

// TẠO ĐƠN ĐẶT HÀNG TRƯỚC
// =============================
exports.createPreorder = (req, res) => {
  const { product_id, user_id, customer_name, phone, address, note, color, size, quantity } = req.body;

  if (!customer_name || !phone) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
  }

  // Lấy thông tin sản phẩm
  const productSql = `SELECT name, price FROM products WHERE product_id = ?`;

  db.query(productSql, [product_id], (err, productResult) => {
    if (err || productResult.length === 0) {
      console.error("❌ Lỗi khi lấy sản phẩm:", err);
      return res.status(400).json({ message: "Sản phẩm không hợp lệ!" });
    }

    const product_name = productResult[0].name;
    const price = productResult[0].price;
    const qty = quantity && quantity > 0 ? quantity : 1;

    // Lấy thông tin material để check size/color và lấy stock nếu cần
    const materialSql = `
      SELECT * FROM materials 
      WHERE product_id = ? AND color = ? AND size = ? LIMIT 1
    `;
    db.query(materialSql, [product_id, color, size], (errMat, materialResult) => {
      if (errMat) {
        console.error("❌ Lỗi khi lấy material:", errMat);
        return res.status(500).json({ message: "Lỗi server khi lấy material!" });
      }

      // Nếu tồn tại material hợp lệ thì dùng stock, nếu cần
const fullProductName = `${product_name}${size ? " - " + size : ""}${color ? " - " + color : ""}`;

      const sql = `
        INSERT INTO preorders (product_id, user_id, product_name, customer_name, phone, address, note, price, quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          product_id,
          user_id || null,
          fullProductName,
          customer_name,
          phone,
          address || null,
          note || null,
          price,
          qty,
        ],
        (errInsert, result) => {
          if (errInsert) {
            console.error("❌ Lỗi khi tạo preorder:", errInsert);
            return res.status(500).json({ message: "Lỗi server khi tạo preorder!" });
          }

          res.status(201).json({
            message: "✅ Tạo đơn đặt hàng trước thành công!",
            preorder_id: result.insertId,
            data: {
              product_id,
              user_id: user_id || null,
              product_name: fullProductName,
              customer_name,
              phone,
              address: address || null,
              note: note || null,
              price,
              quantity: qty,
              total_amount: price * qty,
              created_at: new Date(),
            },
          });
        }
      );
    });
  });
};
// =============================
// LẤY TẤT CẢ ĐƠN ĐẶT HÀNG TRƯỚC
// =============================
exports.getAllPreorders = (req, res) => {
  const sql = `SELECT * FROM preorders ORDER BY created_at DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi lấy danh sách preorder:", err);
      return res.status(500).json({ message: "Lỗi server khi lấy danh sách preorder!" });
    }
    res.json(results);
  });
};

// =============================
// LẤY PREORDER THEO PREORDER_ID
// =============================
exports.getPreorderById = (req, res) => {
  const { preorder_id } = req.params;

  const sql = `SELECT * FROM preorders WHERE preorder_id = ? LIMIT 1`;

  db.query(sql, [preorder_id], (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi lấy preorder:", err);
      return res.status(500).json({ message: "Lỗi server khi lấy preorder!" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt hàng trước!" });
    }

    res.json(results[0]);
  });
};

// =============================
// LẤY PREORDER THEO USER_ID
// =============================
exports.getPreordersByUser = (req, res) => {
  const { user_id } = req.params;

  const sql = `SELECT * FROM preorders WHERE user_id = ? ORDER BY created_at DESC`;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi lấy preorder theo user_id:", err);
      return res.status(500).json({ message: "Lỗi server khi lấy preorder theo user!" });
    }
    res.json(results);
  });
};
