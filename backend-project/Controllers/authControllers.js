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

  // 1. Tìm user không phân biệt hoa thường:
  const sqlIgnoreCase = "SELECT * FROM users WHERE LOWER(username) = LOWER(?)";

  db.query(sqlIgnoreCase, [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      // Không tìm thấy username (kể cả khi ignore case)
      return res.status(401).json({ message: "Tên Đăng Nhập Và Mật Khẩu không chính xác" });
    }

    const user = results[0];

    // 2. Kiểm tra chữ hoa-thường có chính xác không
    if (user.username !== username) {
      return res.status(401).json({ message: "Tên Đăng Nhập Và Mật Khẩu không chính xác" });
    }

    // 3. So sánh mật khẩu
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Tên Đăng Nhập Và Mật Khẩu không chính xác" });

    // 4. Tạo token
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    // 5. Trả về dữ liệu
    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address:user.address
      }
    });
  });
};