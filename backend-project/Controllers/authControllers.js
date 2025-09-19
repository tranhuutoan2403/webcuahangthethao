const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // file kết nối MySQL của bạn

const SECRET_KEY = "your_secret_key"; // đổi thành key mạnh hơn

// Đăng ký
exports.register = (req, res) => {
  const { username, email, password, phone, address } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO users (username, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, 'user')";
  db.query(sql, [username, email, hashedPassword, phone, address], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Đăng ký thành công!" });
  });
};

// Đăng nhập
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Vui lòng nhập username và mật khẩu!" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: "Username không tồn tại!" });

    const user = results[0];

    // So sánh password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Sai mật khẩu!" });

    // Tạo token
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    // TRẢ VỀ ĐẦY ĐỦ DỮ LIỆU
    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user.user_id,
        username: user.username, // Quan trọng!
        email: user.email,
        role: user.role
      }
    });
  });
};

