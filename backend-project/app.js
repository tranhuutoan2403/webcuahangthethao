const express = require('express'); // import express trước
const app = express();               // tạo app sau khi import
const cors = require('cors');
const path = require('path');
const db = require('./db');

const productRoutes = require('./Routers/productRouter');
const userRoutes = require('./Routers/userRouter');
const authRoutes = require('./Routers/authRouter');
const categogyRoutes = require('./Routers/CategogyRouter');
const voucherRoutes = require("./Routers/voucherRouter");
const checkoutRoutes = require("./Routers/CheckoutRouter");
const orderRoutes = require('./Routers/orderRouter');
const productMaterialRouter = require("./Routers/MaterialProductRouter");
// Cho phép gọi API từ frontend
app.use(cors());

// Static để phục vụ ảnh
app.use('/images', express.static(path.join(__dirname, '/public/images')));

// JSON Parser
app.use(express.json());

// Route test
app.get('/api', (req, res) => {
  res.send('Kết nối thành công');
});

// Sử dụng routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categogy', categogyRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/checkout", checkoutRoutes);
// Routes order
app.use('/api/orders', orderRoutes);
// Routes ProductMaterials
app.use("/api/product-materials", productMaterialRouter);

// Chạy server
app.listen(5000, () => {
  console.log('Server đang chạy tại http://localhost:5000');
});
