const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// LƯU Ý: Đảm bảo bạn có hàm addProductVariants trong MaterialProductController
// const materialCtrl = require('./MaterialProductControllers'); 

// ==================== TẠO FOLDER VÀ MULTER CONFIG ====================
const uploadFolder = path.join(__dirname, '../public/images');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    // LƯU Ý: Thêm timestamp là cách tốt nhất để tránh trùng tên file
    filename: (req, file, cb) => cb(null,file.originalname), 
});

const upload = multer({ storage });
// Chỉ chấp nhận file 'image' (ảnh chính) từ form
exports.uploadImage = upload.single('image'); 
exports.getAllProduct = (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getProductById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM products WHERE product_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(results[0]);
  });
};

exports.getProductBySlug = (req, res) => {
  const { slug } = req.params;

  db.query('SELECT * FROM products WHERE slug = ?', [slug], (err, productResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!productResults.length) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    const product = productResults[0];
    const productId = product.product_id;

    db.query(
      'SELECT color, size, stock, image FROM materials WHERE product_id = ?',
      [productId],
      (err2, materialResults) => {
        if (err2) return res.status(500).json({ error: err2.message });

        res.json({
         product_id: product.product_id,
         name: product.name,
         image: product.image,
        price:product.price,
        description:product.description,
          materials: materialResults
        });
      }
    );
  });
};

exports.getProductsByCategorySlug = (req, res) => {
  const { slug } = req.params;
   const sql = `
        SELECT p.* FROM products p
        JOIN categories c ON p.category_id = c.category_id
        WHERE c.slug = ?
    `.replace(/\s+/g, ' ').trim(); 
  db.query(sql, [slug], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { category_id, name, slug, description, price, stock } = req.body;
const image = req.files && req.files['image'] ? req.files['image'][0].filename : req.body.image;

  db.query(
    'UPDATE products SET category_id=?, name=?, slug=?, description=?, price=?, image=? WHERE product_id=?',
    [category_id || null, name, slug, description, price, image, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Cập nhật sản phẩm thành công' });
    }
  );
  // Lưu ý: Hàm updateProduct này không dùng addProductVariants, nó chỉ update thông tin cơ bản.
  // Nếu bạn muốn cập nhật/thêm biến thể ở đây, hãy dùng endpoint createOrUpdateProduct đã sửa ở trên.
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM materials WHERE product_id=?', [id], (err1) => {
    if (err1) return res.status(500).json({ error: err1.message });

    db.query('DELETE FROM products WHERE product_id=?', [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Xóa sản phẩm thành công' });
    });
  });
};
exports.getAllCategories = (req, res) => {
  db.query('SELECT category_id, name, slug, HinhAnh FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
exports.getAllCategorySlugs = (req, res) => {
  db.query('SELECT category_id, slug, name FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};