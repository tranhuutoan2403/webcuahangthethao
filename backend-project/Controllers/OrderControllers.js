const db = require("../db");

// =============================
// LẤY DANH SÁCH ĐƠN HÀNG
// =============================
exports.getAllOrders = (req, res) => {
  const sql = `
SELECT 
  o.order_id,
  o.user_id,
  u.username,
  u.email,
  a.recipient_name,
  a.phone AS receiver_phone,
  a.address_line,
  o.total_amount,
  o.final_amount,
  o.status,
  o.created_at,
  od.order_item_id,
  od.product_id,
  od.material_id,
  od.quantity,
  od.price AS product_price,
  od.discount_amount,
  (od.quantity * od.price - od.discount_amount) AS subtotal,
  p.name AS product_name,
  m.color AS material_color,
  m.size AS material_size
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN address a ON o.address_id = a.id
JOIN order_details od ON o.order_id = od.order_id
JOIN products p ON od.product_id = p.product_id
LEFT JOIN materials m ON od.material_id = m.material_id
ORDER BY o.created_at DESC
`;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const orders = {};
    results.forEach((row) => {
      if (!orders[row.order_id]) {
        orders[row.order_id] = {
          order_id: row.order_id,
          user: {
            id: row.user_id,
            username: row.username,
            email: row.email,
          },
          receiver: {
            name: row.recipient_name,
            phone: row.receiver_phone,
            address: row.address_line,
          },
          total_amount: row.total_amount,
          final_amount: row.final_amount,
          status: row.status,
          created_at: row.created_at,
          items: [],
        };
      }

      orders[row.order_id].items.push({
        order_item_id: row.order_item_id,
        product_id: row.product_id,
        product_name: row.product_name,
        material_id: row.material_id,
        material_color: row.material_color,
        material_size: row.material_size,
        quantity: row.quantity,
        price: row.product_price,
        discount_amount: row.discount_amount,
        subtotal: row.subtotal,
      });
    });

    res.json(Object.values(orders));
  });
};

// =============================
// LẤY CHI TIẾT ĐƠN HÀNG THEO ID
// =============================
exports.getOrderById = (req, res) => {
  const orderId = req.params.id;
  const sql = `
SELECT 
  o.order_id,
  o.user_id,
  u.username,
  u.email,
  o.recipient_name,
  o.phone AS receiver_phone,
  o.address_line,
  o.total_amount,
  o.final_amount,
  o.status,
  o.created_at,
  od.order_item_id,
  od.product_id,
  od.material_id,
  od.quantity,
  od.price AS product_price,
  od.discount_amount,
  (od.quantity * od.price - od.discount_amount) AS subtotal,
  p.name AS product_name,
  m.color AS material_color,
  m.size AS material_size
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN order_details od ON o.order_id = od.order_id
JOIN products p ON od.product_id = p.product_id
LEFT JOIN materials m ON od.material_id = m.material_id
WHERE o.order_id = ?
`;

  db.query(sql, [orderId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length)
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });

    const order = {
      order_id: results[0].order_id,
      user: {
        id: results[0].user_id,
        username: results[0].username,
        email: results[0].email,
      },
      receiver: {
        name: results[0].recipient_name,
        phone: results[0].receiver_phone,
        address: results[0].address_line,
      },
      total_amount: results[0].total_amount,
      final_amount: results[0].final_amount,
      status: results[0].status,
      created_at: results[0].created_at,
      items: [],
    };

    results.forEach((row) => {
      order.items.push({
        order_item_id: row.order_item_id,
        product_id: row.product_id,
        product_name: row.product_name,
        material_id: row.material_id,
        material_color: row.material_color,
        material_size: row.material_size,
        quantity: row.quantity,
        price: row.product_price,
        discount_amount: row.discount_amount,
        subtotal: row.subtotal,
      });
    });

    res.json(order);
  });
};

// ==================== CREATE ORDER ====================
exports.createOrder = (req, res) => {
  const {
    user_id,
    recipient_name,
    phone,
    address_line,
    items,
    total_amount,
    final_amount,
    voucher_code,
  } = req.body;

  if (!items || items.length === 0)
    return res.status(400).json({ error: "Giỏ hàng trống" });

  if (!recipient_name || !phone || !address_line)
    return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin người nhận" });

  // ✅ Kiểm tra tồn kho trong materials
  let checkedCount = 0;
  let isErrorSent = false;

  items.forEach((it) => {
    if (isErrorSent) return;

    if (!it.material_id) {
      isErrorSent = true;
      return res.status(400).json({ error: "Thiếu thông tin biến thể cho sản phẩm" });
    }

    const checkStockSql = "SELECT stock FROM materials WHERE material_id = ? AND product_id = ?";
    db.query(checkStockSql, [it.material_id, it.product_id], (err, results) => {
      if (isErrorSent) return;

      if (err) {
        isErrorSent = true;
        return res.status(500).json({ error: err.message });
      }

      if (!results.length || results[0].stock < it.quantity) {
        isErrorSent = true;
        const currentStock = results.length ? results[0].stock : 0;
        return res.status(400).json({
          error: `Biến thể ID ${it.material_id} chỉ còn ${currentStock} sản phẩm, không đủ số lượng (${it.quantity})`,
        });
      }

      checkedCount++;
      if (checkedCount === items.length) {
        insertOrder(
          user_id,
          recipient_name,
          phone,
          address_line,
          total_amount,
          final_amount,
          items,
          voucher_code,
          res
        );
      }
    });
  });
};

// ==================== INSERT ORDER ====================
function insertOrder(
  user_id,
  recipient_name,
  phone,
  address_line,
  total_amount,
  final_amount,
  items,
  voucher_code,
  res
) {
  const addressSql = `
INSERT INTO address (user_id, recipient_name, phone, address_line, is_default)
VALUES (?, ?, ?, ?, 0)
`;
  db.query(addressSql, [user_id, recipient_name, phone, address_line], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const addressId = result.insertId;

    const orderSql = `
INSERT INTO orders (user_id, address_id, total_amount, final_amount, status, created_at)
VALUES (?, ?, ?, ?, 'pending', NOW())
`;
    db.query(orderSql, [user_id, addressId, total_amount, final_amount], (err2, result2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      const orderId = result2.insertId;

      const detailsSql = `
INSERT INTO order_details (order_id, product_id, material_id, quantity, price, discount_amount)
VALUES ?
`;
      const values = items.map((item) => [
        orderId,
        item.product_id,
        item.material_id,
        item.quantity,
        item.price,
        item.discount_amount || 0,
      ]);

      db.query(detailsSql, [values], (err3) => {
        if (err3) return res.status(500).json({ error: err3.message });

        // ✅ Giảm stock trong bảng materials
        let updatedCount = 0;
        items.forEach((item) => {
          const updateStockSql = `
UPDATE materials
SET stock = CASE WHEN stock - ? < 0 THEN 0 ELSE stock - ? END
WHERE material_id = ?
`;
          db.query(updateStockSql, [item.quantity, item.quantity, item.material_id], (err4) => {
            if (err4) console.error("❌ Lỗi cập nhật stock materials:", err4);

            updatedCount++;
            if (updatedCount === items.length) {
              res.json({
                order_id: orderId,
                message: "Đặt hàng thành công! Tồn kho đã được cập nhật trong materials.",
              });
            }
          });
        });
      });
    });
  });
}
// LẤY ĐƠN HÀNG THEO USER ID
// =============================
exports.getOrdersByUser = (req, res) => {
  const userId = req.params.user_id;
  const sql = `
    SELECT o.*, a.recipient_name, a.phone, a.address_line
    FROM orders o
    JOIN address a ON o.address_id = a.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};