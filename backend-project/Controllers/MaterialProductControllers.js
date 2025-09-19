const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ==================== TẠO FOLDER VÀ MULTER CONFIG ====================
const uploadFolder = path.join(__dirname, '../public/images'); 
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null,  file.originalname),
});

const upload = multer({ storage });
// EXPORT middleware Multer để Router sử dụng
exports.uploadAny = upload.any(); // Cho route tạo/cập nhật phức tạp
exports.uploadSingleImage = upload.single('image'); // Cho route cập nhật cơ bản


// ================== HÀM PHỤ: Thêm hoặc cập nhật biến thể (materials) ==================
function addProductVariants(productId, productName, variants, callback) {
    if (!productId || isNaN(parseInt(productId))) {
         console.error("LỖI NỘI BỘ: Product ID không hợp lệ:", productId);
         return callback(new Error("ID sản phẩm không hợp lệ khi thêm biến thể."));
    }
    
    if (!variants || variants.length === 0) return callback();

    let total = variants.length;
    let count = 0;
    let hasError = false;

    // Đảm bảo checkDone được định nghĩa đúng phạm vi
    const checkDone = (err) => {
        if (err && !hasError) {
            hasError = true;
            console.error("LỖI SQL TRONG addProductVariants:", err);
            return callback(err);
        }
        count++;
        if (count === total && !hasError) {
            callback(null);
        }
    };

    variants.forEach(item => {
        const { color, size, stock, image } = item;
        
        let skuParts = [(productName || "PROD").replace(/\s/g, '-')];
        if (color) skuParts.push(color.replace(/\s/g, '-'));
        if (size) skuParts.push(`SIZE-${size}`);
        const sku = skuParts.join('-');

        // 1. Kiểm tra biến thể đã tồn tại chưa (Đã thêm .trim() để sửa lỗi SQL Syntax)
        const checkMaterialSql = `
            SELECT material_id FROM materials
            WHERE product_id = ? AND color = ? AND size = ?
        `.replace(/\s+/g, ' ').trim(); 
        
        db.query(checkMaterialSql, [productId, color || null, size || null], (err, rows) => {
            if (err) return checkDone(err);

            if (rows.length > 0) {
                // 2a. TỒN TẠI → Cập nhật stock
                const updateSql = `UPDATE materials SET stock = stock + ? WHERE material_id = ?`.trim();
                db.query(updateSql, [stock || 0, rows[0].material_id], (err2) => {
                    checkDone(err2);
                });
            } else {
                // 2b. CHƯA TỒN TẠI → Thêm mới
                const insertSql = `
                INSERT INTO materials (product_id, color, size, sku, stock, image)
                VALUES (?, ?, ?, ?, ?, ?)
                `.replace(/\s+/g, ' ').trim();
                db.query(insertSql, [productId, color || null, size || null, sku, stock || 0, image || null], (err3) => {
                    checkDone(err3);
                });
            }
        });
    });
}
exports.addProductVariants = addProductVariants;

// ====================== API KIỂM TRA TỒN TẠI SẢN PHẨM ======================
exports.checkProductExistence = (req, res) => {
    const { productId } = req.params;
    const numericProductId = parseInt(productId); 
    
    if (isNaN(numericProductId) || numericProductId <= 0) {
        return res.json({ exists: false, error: "ID sản phẩm không hợp lệ" });
    }
    
    const sql = 'SELECT product_id, name, slug FROM products WHERE product_id = ?'.trim();
    db.query(sql, [numericProductId], (err, results) => {
        if (err) {
             console.error("LỖI SQL: [checkProductExistence]", err);
             return res.status(500).json({ error: err.message });
        }
        
        if (results.length > 0) {
             res.json({ 
                 exists: true, 
                 productName: results[0].name,
                 slug: results[0].slug
             });
        } else {
             res.json({ exists: false });
        }
    });
};


// ====================== HÀM CHÍNH: Tạo mới hoặc Cập nhật biến thể ======================
exports.createOrUpdateProduct = (req, res) => {
    // Đã thêm stock vào đây (ĐÚNG)
    const { product_id, category_id, name, slug, description, price, stock, variants } = req.body;
    
    const files = req.files || []; 
    
    const mainImageFile = files.find(f => f.fieldname === 'image');
    // Logic lấy ảnh chính: ưu tiên ảnh mới upload, sau đó là ảnh cũ (req.body.image)
    const image = mainImageFile ? mainImageFile.filename : req.body.image; 
    
    let parsedVariants;
    try {
        parsedVariants = variants ? JSON.parse(variants) : []; 
    } catch (error) {
        return res.status(400).json({ error: "Dữ liệu biến thể (variants) không hợp lệ" });
    }
    
    // CẬP NHẬT TÊN FILE ẢNH MÀU SẮC VÀO MẢNG BIẾN THỂ
    if (files.length > 0) {
        parsedVariants.forEach(variant => {
             const key = `colorFile-${variant.color}`;
             const colorFile = files.find(f => f.fieldname === key);
             
             if (colorFile) {
                 variant.image = colorFile.filename;
             }
        });
    }

    // ===================================================
    // 1. CÓ product_id (Thêm/Cập nhật biến thể)
    // ===================================================
    if (product_id && product_id.trim() !== "") {
        const numericProductId = parseInt(product_id);
        if (isNaN(numericProductId)) return res.status(400).json({ error: "Product ID không hợp lệ." });
        
// B1: Kiểm tra tồn tại và lấy tên sản phẩm
        const checkProductSql = `SELECT name FROM products WHERE product_id = ?`.trim();
        db.query(checkProductSql, [numericProductId], (err, rows) => {
            if (err) {
                console.error("LỖI SQL: [createOrUpdateProduct - SELECT Name]", err);
                return res.status(500).json({ error: err.message });
            }
            if (rows.length === 0) {
                return res.status(404).json({ error: "Không tìm thấy sản phẩm với Product ID này" });
            }
            
            const productName = rows[0].name;

            // B2: Thêm hoặc update biến thể
            addProductVariants(numericProductId, productName, parsedVariants, (err2) => {
                if (err2) return res.status(500).json({ error: "Lỗi khi thêm biến thể: " + err2.message });
                return res.json({ message: "Thêm biến thể thành công", product_id: numericProductId });
            });
        });
    } 
    // ===================================================
    // 2. KHÔNG có product_id (Tạo sản phẩm mới)
    // ===================================================
    else {
        // ĐÃ SỬA: BỔ SUNG KIỂM TRA !stock
        if (!name || !price || !category_id || !slug || !stock || !image) { 
             return res.status(400).json({ error: "Thiếu thông tin bắt buộc (Tên, Giá, Danh mục, Slug, Stock, Hình ảnh chính) để tạo sản phẩm mới" });
        }
        
        // B1: Thêm sản phẩm cơ bản (Đã thêm STOCK vào SQL)
        const insertProductSql = `
            INSERT INTO products (category_id, name, slug, description, price, stock, image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `.replace(/\s+/g, ' ').trim();
        
        db.query(insertProductSql, [category_id, name, slug, description, price, stock, image], (err3, result) => {
            if (err3) {
                 console.error("LỖI SQL: [createOrUpdateProduct - INSERT Product]", err3);
                 return res.status(500).json({ error: "Lỗi khi tạo sản phẩm mới: " + err3.message });
            }

            const newProductId = result.insertId;
            const newProductName = name;

            // B2: Thêm biến thể đầu tiên
            addProductVariants(newProductId, newProductName, parsedVariants, (err4) => {
                if (err4) {
                    console.error("Lỗi khi thêm biến thể, xem xét xóa sản phẩm ID:", newProductId);
                    return res.status(500).json({ error: "Thêm sản phẩm thành công nhưng lỗi khi thêm biến thể: " + err4.message });
                }
                return res.json({ message: "Thêm sản phẩm mới và biến thể thành công", product_id: newProductId });
            });
        });
    }
};

// ====================== MATERIAL CRUD ======================

exports.getMaterialsByProduct = (req, res) => {
const { productId } = req.params;
  const sql = 'SELECT * FROM materials WHERE product_id = ?'.trim();
  db.query(sql, [productId], (err, results) => {
    if (err) {
         console.error("LỖI SQL: [getMaterialsByProduct]", err);
         return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.updateMaterial = (req, res) => {
  const { id } = req.params;
  const { color, size, stock } = req.body;

  const sql = 'UPDATE materials SET color=?, size=?, stock=? WHERE material_id=?'.trim();
  db.query(
    sql,
    [color || null, size || null, stock || 0, id],
    (err) => {
      if (err) {
           console.error("LỖI SQL: [updateMaterial]", err);
           return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Cập nhật material thành công' });
    }
  );
};

exports.deleteMaterial = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM materials WHERE material_id=?'.trim();
  db.query(sql, [id], (err) => {
    if (err) {
          console.error("LỖI SQL: [deleteMaterial]", err);
          return res.status(500).json({ error: err.message });
     }
    res.json({ message: 'Xóa material thành công' });
  });
};