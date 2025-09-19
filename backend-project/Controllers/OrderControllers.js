const db = require('../db');

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
      od.product_id,
      p.name AS product_name,
      od.quantity,
      od.price AS product_price,
      od.discount_amount,
      (od.quantity * od.price - od.discount_amount) AS subtotal
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    JOIN address a ON o.address_id = a.id
    JOIN order_details od ON o.order_id = od.order_id
    JOIN products p ON od.product_id = p.product_id
    ORDER BY o.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Lỗi truy vấn orders:', err);
      return res.status(500).json({ message: 'Lỗi server khi lấy danh sách đơn hàng', error: err });
    }

    // Gom nhóm dữ liệu theo order_id
    const orders = {};
    results.forEach(row => {
      if (!orders[row.order_id]) {
        orders[row.order_id] = {
          order_id: row.order_id,
          user: {
            id: row.user_id,
            username: row.username,
            email: row.email
          },
          receiver: {
            name: row.recipient_name,
            phone: row.receiver_phone,
            address: row.address_line
          },
          total_amount: row.total_amount,
          final_amount: row.final_amount,
          status: row.status,
          created_at: row.created_at,
          items: []
        };
      }

      // Thêm sản phẩm vào mảng items
      orders[row.order_id].items.push({
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.product_price,
        discount_amount: row.discount_amount,
        subtotal: row.subtotal
      });
    });

    // Trả về dữ liệu dạng mảng
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
      a.recipient_name,
      a.phone AS receiver_phone,
      a.address_line,
      o.total_amount,
      o.final_amount,
      o.status,
      o.created_at,
      od.product_id,
      p.name AS product_name,
      od.quantity,
      od.price AS product_price,
      od.discount_amount,
      (od.quantity * od.price - od.discount_amount) AS subtotal
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    JOIN address a ON o.address_id = a.id
    JOIN order_details od ON o.order_id = od.order_id
    JOIN products p ON od.product_id = p.product_id
    WHERE o.order_id = ?
  `;

  db.query(sql, [orderId], (err, results) => {
    if (err) {
      console.error('❌ Lỗi truy vấn order detail:', err);
      return res.status(500).json({ message: 'Lỗi server khi lấy chi tiết đơn hàng', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    const order = {
      order_id: results[0].order_id,
      user: {
        id: results[0].user_id,
        username: results[0].username,
        email: results[0].email
      },
      receiver: {
        name: results[0].recipient_name,
        phone: results[0].receiver_phone,
        address: results[0].address_line
      },
      total_amount: results[0].total_amount,
      final_amount: results[0].final_amount,
      status: results[0].status,
      created_at: results[0].created_at,
      items: []
    };

    results.forEach(row => {
      order.items.push({
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.product_price,
        discount_amount: row.discount_amount,
        subtotal: row.subtotal
      });
    });

    res.json(order);
  });
};
