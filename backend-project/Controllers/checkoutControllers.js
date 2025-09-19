// controllers/checkoutController.js
const db = require("../db");

// Thanh toán
exports.checkout = (req, res) => {
  const { user_id, recipient_name, phone, address_line, cart, voucher_code } = req.body;

  if (!user_id || !recipient_name || !phone || !address_line || !cart || cart.length === 0) {
    return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  }

  // 1. Tạo address mới
  db.query(
    "INSERT INTO address (user_id, recipient_name, phone, address_line, is_default) VALUES (?, ?, ?, ?, 0)",
    [user_id, recipient_name, phone, address_line],
    (err, addrResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Lỗi khi tạo địa chỉ" });
      }
      const address_id = addrResult.insertId;

      // 2. Tính tổng tiền
      let totalAmount = 0;
      cart.forEach(item => {
        totalAmount += Number(item.price) * Number(item.quantity);
      });

      // 3. Kiểm tra voucher
      if (voucher_code) {
        db.query(
          "SELECT * FROM voucher WHERE code = ? AND status='active'",
          [voucher_code],
          (err, vouchers) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Lỗi khi kiểm tra voucher" });
            }
            if (vouchers.length === 0) {
              return res.status(400).json({ error: "Mã giảm giá không hợp lệ hoặc hết hạn" });
            }

            const voucher = vouchers[0];
            const voucher_id = voucher.voucher_id;
            let finalAmount =
              voucher.discount_type === "percent"
                ? Math.round(totalAmount * (1 - voucher.discount_value / 100))
                : Math.max(0, totalAmount - voucher.discount_value);

            // 4. Tạo order
            db.query(
              "INSERT INTO orders (user_id, voucher_id, address_id, total_amount, final_amount, status) VALUES (?, ?, ?, ?, ?, 'pending')",
              [user_id, voucher_id, address_id, totalAmount, finalAmount],
              (err, orderResult) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ error: "Lỗi khi tạo đơn hàng" });
                }
                const order_id = orderResult.insertId;

                // 5. Tạo order_details
                let completed = 0;
                cart.forEach(item => {
                  db.query(
                    "INSERT INTO order_details (order_id, product_id, quantity, price, discount_amount) VALUES (?, ?, ?, ?, ?)",
                    [order_id, item.productId, Number(item.quantity), Number(item.price), 0],
                    (err) => {
                      if (err) {
                        console.error(err);
                        return res.status(500).json({ error: "Lỗi khi thêm chi tiết đơn hàng" });
                      }
                      completed++;
                      if (completed === cart.length) {
                        return res.json({ message: "Thanh toán thành công", order_id });
                      }
                    }
                  );
                });
              }
            );
          }
        );
      } else {
        // Nếu không có voucher
        const voucher_id = null;
        const finalAmount = totalAmount;

        db.query(
          "INSERT INTO orders (user_id, voucher_id, address_id, total_amount, final_amount, status) VALUES (?, ?, ?, ?, ?, 'pending')",
          [user_id, voucher_id, address_id, totalAmount, finalAmount],
          (err, orderResult) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Lỗi khi tạo đơn hàng" });
            }
            const order_id = orderResult.insertId;

            let completed = 0;
            cart.forEach(item => {
              db.query(
                "INSERT INTO order_details (order_id, product_id, quantity, price, discount_amount) VALUES (?, ?, ?, ?, ?)",
                [order_id, item.productId, Number(item.quantity), Number(item.price), 0],
                (err) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Lỗi khi thêm chi tiết đơn hàng" });
                  }
                  completed++;
                  if (completed === cart.length) {
                    return res.json({ message: "Thanh toán thành công", order_id });
                  }
                }
              );
            });
          }
        );
      }
    }
  );
};
