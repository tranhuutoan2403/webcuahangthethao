import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/Webpage/Header';
import CategoryPage from './component/Webpage/CategogyPage';
import Footer from './component/Webpage/Footer';
import TrangChu from './component/Webpage/TrangChu';
import Register from './component/Webpage/Register';
import Login from './component/Webpage/Login';
import ProductDetail from './component/Webpage/ProductDetail';
import Profile from './component/Webpage/Profile';
import ProfileUpdate from './component/Webpage/ProfileUpdate';
import ProfileChangePass from './component/Webpage/ProfileChangePass';
import GioHang from './component/Webpage/GioHang';
import Checkout from './component/Webpage/Checkout';
import OrderSuccess from './component/Webpage/Ordersucces';
import News from './component/Webpage/News';
import NewsDetail from './component/Webpage/NewsDetails';
import AboutUs from './component/Webpage/AboutUs';
import BrandPage from './component/Webpage/BrandPage';
import MyOrders from './component/Webpage/MyOrder';
function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<TrangChu />} />

                {/* ✅ Trang tìm kiếm cũng dùng TrangChu luôn */}
                <Route path="/tim-kiem" element={<TrangChu />} />
                {/* Danh sách sản phẩm */}
            
                {/* Trang chi tiết sản phẩm theo slug */}
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/categogy/:slug" element={<CategoryPage />} />
                <Route path="/brand/:slug" element={<BrandPage />} />
                <Route path="/Login" element={<Login/>} />
                <Route path="/Register" element={<Register/>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/update" element={<ProfileUpdate />} />
                <Route path="/profile/change-password" element={<ProfileChangePass />} />
                <Route path="/giohang" element={<GioHang />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/My-order" element={<MyOrders />} />
                <Route path="news/categogy/:slug" element={<News />} />
              {/* Chi tiết từng bài viết dựa trên slug */}
                <Route path="news/:slug" element={<NewsDetail />} />
                <Route path="/news/:slug" element={<AboutUs />} />
                <Route path="/order-success/:id" element={<OrderSuccess />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
