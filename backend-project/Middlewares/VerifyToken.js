const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key"; // giống trong authController

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: "Không có token!" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ message: "Token không hợp lệ!" });
    req.user = user; // lưu thông tin token để sử dụng
    next();
  });
}

module.exports = verifyToken;
