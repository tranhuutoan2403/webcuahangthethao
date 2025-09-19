import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/Webpage/Header';
import CategoryPage from './component/Webpage/CategogyPage';
import Footer from './component/Webpage/Footer';
import TrangChu from './component/Webpage/TrangChu';
import Register from './component/Webpage/Register';
import Login from './component/Webpage/Login';
import ProductDetail from './component/Webpage/ProductDetail';
import Profile from './component/Webpage/Profile';
import GioHang from './component/Webpage/GioHang';
import Checkout from './component/Webpage/Checkout';
import OrderSuccess from './component/Webpage/Ordersucces';
function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<TrangChu />} />
                {/* Danh sách sản phẩm */}
            
                {/* Trang chi tiết sản phẩm theo slug */}
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/categogy/:slug" element={<CategoryPage />} />
                <Route path="/Login" element={<Login/>} />
                <Route path="/Register" element={<Register/>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/giohang" element={<GioHang />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:id" element={<OrderSuccess />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
