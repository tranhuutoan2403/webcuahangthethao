const db = require('../db');
const bcrypt = require('bcrypt'); 

// Lấy danh sách tất cả user
exports.getAllUsers = (req, res) => {
  const sql = "SELECT * FROM users WHERE status = 'active'";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Lấy 1 user theo ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM users WHERE user_id = ?', [id], (err, results) => {
    if (err) 
      return res.status(500).json({ error: err.message });
    if (results.length === 0) 
      return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json(results[0]);
  });
};

// Thêm user mới
exports.createUser = (req, res) => {
  const { username, email, password, phone, address, role } = req.body;

  const finalRole = role || "admin"; // dùng role từ frontend, mặc định admin
  const hashedPassword = bcrypt.hashSync(password, 10); // hash password

  const sql = `
    INSERT INTO users (username, email, password, phone, address, role, status) 
    VALUES (?, ?, ?, ?, ?, ?, 'active')
  `;
  db.query(sql, [username, email, hashedPassword, phone, address, finalRole], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Thêm user thành công', id: result.insertId });
  });
};

// Cập nhật user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { username, email, password, phone, address } = req.body;
  db.query(
    'UPDATE users SET username = ?, email = ?, password = ?, phone = ?, address = ? WHERE user_id = ?', 
    [username, email, password, phone, address, id], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Cập nhật thành công' });
    }
  );
};

// // Xóa user (xóa hẳn khỏi DB)
// exports.deleteUser = (req, res) => {
//   const { id } = req.params;
//   db.query('DELETE FROM users WHERE user_id = ?', [id], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: 'Xóa thành công' });
//   });
// };

// Ẩn user (chỉ đổi status thành inactive)
exports.hideUser = (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE users SET status = 'inactive' WHERE user_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User đã bị ẩn (inactive)' });
  });
};

// Khôi phục user từ trạng thái inactive -> active
exports.restoreUser = (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE users SET status = 'active' WHERE user_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User đã được khôi phục' });
  });
};
// Đổi mật khẩu user
exports.changePassword = (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Lấy mật khẩu hiện tại của user
  const sqlGet = "SELECT password FROM users WHERE user_id = ?";
  db.query(sqlGet, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Người dùng không tồn tại" });

    const hashedPassword = results[0].password;

    // So sánh mật khẩu hiện tại
    const match = bcrypt.compareSync(currentPassword, hashedPassword);
    if (!match) return res.status(400).json({ error: "Mật khẩu hiện tại không đúng" });

    // Hash mật khẩu mới
    const newHashedPassword = bcrypt.hashSync(newPassword, 10);

    // Cập nhật vào DB
    const sqlUpdate = "UPDATE users SET password = ? WHERE user_id = ?";
    db.query(sqlUpdate, [newHashedPassword, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Đổi mật khẩu thành công" });
    });
  });
};
