const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==================== FOLDER LƯU ẢNH ====================
const uploadFolder = path.join(__dirname, "../public/images");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null,file.originalname),
});
const upload = multer({ storage });

// Export middleware upload
exports.uploadAny = upload.any();

// ==================== CRUD MATERIALS ====================

// Thêm 1 biến thể đơn lẻ
exports.createMaterial = (req, res) => {
  const { product_id, color, size, stock } = req.body;
  const image = req.file ? req.file[0].filename : null;

  if (!product_id || !color || !size) {
    return res.status(400).json({ error: "Thiếu thông tin bắt buộc (product_id, color, size)" });
  }

  const sku = `PROD-${product_id}-${color}-${size}`;
  const sql = `INSERT INTO materials (product_id, color, size, sku, stock, image) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [product_id, color, size, sku, stock || 0, image], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Thêm biến thể thành công", material_id: result.insertId });
  });
};

// Thêm nhiều biến thể cùng lúc
exports.addVariants = (req, res) => {
  try {
    const { product_id, variants } = req.body;
    if (!product_id || !variants) return res.status(400).json({ error: "Thiếu product_id hoặc variants" });

    const variantsArray = JSON.parse(variants);
    if (!Array.isArray(variantsArray) || variantsArray.length === 0) {
      return res.status(400).json({ error: "Danh sách variants rỗng" });
    }

    // Lấy tên sản phẩm và danh mục
    const sqlProduct = `
      SELECT p.name AS productName, c.name AS categoryName
      FROM products p
      JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `;
    db.query(sqlProduct, [product_id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!results.length) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });

      const { productName, categoryName } = results[0];

      const values = variantsArray.map(v => {
        const color = v.color ? v.color.replace(/\s+/g, '-') : '';
        const size = v.size ? `SIZE-${v.size}` : '';
        const sku = `${productName.replace(/\s+/g, '-')}-${color}-${size}`;
        return [product_id, v.color || null, v.size || null, sku, v.stock || 0, v.image || null];
      });

      const sqlInsert = `INSERT INTO materials (product_id, color, size, sku, stock, image) VALUES ?`;
      db.query(sqlInsert, [values], (err2, result) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: "Thêm nhiều biến thể thành công", inserted: result.affectedRows });
      });
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Lấy tất cả material
exports.getAllMaterials = (req, res) => {
  db.query("SELECT * FROM materials ORDER BY material_id ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Lấy material theo product_id
exports.getMaterialsByProduct = (req, res) => {
  const { product_id } = req.params;
  db.query("SELECT * FROM materials WHERE product_id = ?", [product_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Lấy 1 material theo material_id
exports.getMaterialById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM materials WHERE material_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ message: "Không tìm thấy biến thể" });
    res.json(results[0]);
  });
};

// Cập nhật material
exports.updateMaterial = (req, res) => {
  const { id } = req.params;
  const { color, size, stock } = req.body;
  const image = req.files && req.files[0] ? req.files[0].filename : req.body.image;

  const sql = `UPDATE materials SET color=?, size=?, stock=?, image=? WHERE material_id=?`;
  db.query(sql, [color || null, size || null, stock || 0, image || null, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cập nhật biến thể thành công" });
  });
};

// Xóa material
exports.deleteMaterial = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM materials WHERE material_id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Xóa biến thể thành công" });
  });
};
