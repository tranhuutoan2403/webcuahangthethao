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
// thêm Upsert nhiều biến thể (update nếu tồn tại, insert nếu chưa)
exports.upsertVariants = (req, res) => {
  try {
    // Lấy product_id và variants từ FormData
    const product_id = req.body.product_id;
    const variants = req.body.variants;

    if (!product_id || !variants) {
      return res.status(400).json({ error: "Thiếu product_id hoặc variants" });
    }

    const variantsArray = JSON.parse(variants);
    if (!Array.isArray(variantsArray) || variantsArray.length === 0) {
      return res.status(400).json({ error: "Danh sách variants rỗng" });
    }

    // Map file màu nếu có upload
    const filesMap = {};
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const match = file.fieldname.match(/^colorFile-(.+)$/);
        if (match) filesMap[match[1]] = file.filename;
      });
    }

    // Đệ quy xử lý từng variant tuần tự
    const processVariant = (index) => {
      if (index >= variantsArray.length) {
        return res.json({ message: "Upsert variants thành công" });
      }

      const v = variantsArray[index];
      const color = v.color || null;
      const size = v.size || null;
      const stock = v.stock || 0;
      const image = v.image ? filesMap[v.color] || v.image : null;

      // Kiểm tra tồn tại
      const sqlCheck = "SELECT * FROM materials WHERE product_id=? AND color=? AND size=?";
      db.query(sqlCheck, [product_id, color, size], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
          // Update
          const material_id = results[0].material_id;
          const sqlUpdate = "UPDATE materials SET stock=?, image=? WHERE material_id=?";
          db.query(sqlUpdate, [stock, image || results[0].image, material_id], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            processVariant(index + 1);
          });
        } else {
          // Insert mới
          const sku = `PROD-${product_id}-${color}-${size}`;
          const sqlInsert =
            "INSERT INTO materials (product_id, color, size, sku, stock, image) VALUES (?, ?, ?, ?, ?, ?)";
          db.query(sqlInsert, [product_id, color, size, sku, stock, image], (err3) => {
            if (err3) return res.status(500).json({ error: err3.message });
            processVariant(index + 1);
          });
        }
      });
    };

    // Bắt đầu xử lý từ variant đầu tiên
    processVariant(0);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Xóa material
exports.deleteMaterial = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM materials WHERE material_id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Xóa biến thể thành công" });
  });
};
// Lấy stock của material
// =====================
// Lấy stock của material (chỉ cần material_id là đủ)
exports.getStockMaterial = (req, res) => {
  const { material_id } = req.params;

  const sql = "SELECT stock FROM materials WHERE material_id = ?";
  db.query(sql, [material_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!results.length) {
      return res.status(404).json({ error: `Không tìm thấy biến thể có ID = ${material_id}` });
    }

    res.json({ stock: results[0].stock });
  });
};