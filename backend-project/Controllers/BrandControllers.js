const db = require("../db");

// ======================== LẤY TẤT CẢ THƯƠNG HIỆU ========================
exports.getAllBrands = (req, res) => {
  const sql = "SELECT * FROM brands ORDER BY brand_id ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    res.json(results);
  });
};

// ======================== LẤY THƯƠNG HIỆU THEO ID ========================
exports.getBrandById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM brands WHERE brand_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
    res.json(results[0]);
  });
};
// ======================== LẤY THƯƠNG HIỆU THEO SLUG ========================
exports.getBrandBySlug = (req, res) => {
  const { slug } = req.params;
  const sql = "SELECT * FROM brands WHERE slug = ? LIMIT 1";
  db.query(sql, [slug], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
    res.json(results[0]);
  });
};
// ======================== THÊM THƯƠNG HIỆU ========================
exports.createBrand = (req, res) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: "Tên và slug là bắt buộc" });
  }

  const sql = "INSERT INTO brands (name, slug) VALUES (?, ?)";
  db.query(sql, [name, slug], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Slug đã tồn tại" });
      }
      return res.status(500).json({ message: "Lỗi server", error: err });
    }

    res.status(201).json({
      message: "Thêm thương hiệu thành công",
      brand_id: result.insertId,
    });
  });
};

// ======================== CẬP NHẬT THƯƠNG HIỆU ========================
exports.updateBrand = (req, res) => {
  const { id } = req.params;
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: "Tên và slug là bắt buộc" });
  }

  const sql = "UPDATE brands SET name = ?, slug = ? WHERE brand_id = ?";
  db.query(sql, [name, slug, id], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Slug đã tồn tại" });
      }
      return res.status(500).json({ message: "Lỗi server", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy thương hiệu để cập nhật" });
    }

    res.json({ message: "Cập nhật thương hiệu thành công" });
  });
};

// ======================== XÓA THƯƠNG HIỆU ========================
exports.deleteBrand = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM brands WHERE brand_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      // Kiểm tra lỗi ràng buộc foreign key
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({ message: "Không thể xóa thương hiệu này vì có sản phẩm liên kết" });
      }
      return res.status(500).json({ message: "Lỗi server", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy thương hiệu để xóa" });
    }

    res.json({ message: "Xóa thương hiệu thành công" });
  });
};
