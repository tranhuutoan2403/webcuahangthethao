import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./component/sibebar";
import Header from "./component/header";
import Dashboard from "./component/Dashboard";
import User from "./component/User";
import UserUpdate from "./component/UserUpdate";
import UserAdd from "./component/UserAdd";
import Product from "./component/Product";
import ProductAdd from "./component/ProductAdd";
import ProductUpdate from "./component/ProductUpdate";
import AdminLogin from "./component/AdminLogin";
import Categogy from "./component/Categogy";
import CategogyAdd from "./component/CategogyAdd";
import CategogyUpdate from "./component/CategogyUpdate";
import Voucher from "./component/VoucherAdmin";
import Order from "./component/Order";
import FlashSales from "./component/FlashSale";
import FlashSaleAdd from "./component/FlashSaleAdd";
import FlashSaleUpdate from "./component/FlashSaleUpdate";
import FlashSaleProduct from "./component/FlashSaleProduct";
import FlashSaleProductAdd from "./component/FlashSaleProductAdd";
import "./App.css";

function Layout() {
  const location = useLocation();

  // Nếu là trang login thì không render Header và Sidebar
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="app">
      {!isLoginPage && <Header />}

      <div className="main">
        {!isLoginPage && <Sidebar />}

        <div className="content">
          <Routes>
            {/* Trang Login */}
            <Route path="/login" element={<AdminLogin />} />

            {/* Dashboard Admin */}
            <Route path="/" element={<Dashboard />} />

            {/* User */}
            <Route path="/users" element={<User />} />
            <Route path="/users/update/:id" element={<UserUpdate />} />
            <Route path="/users/add" element={<UserAdd />} />

            {/* Product */}
            <Route path="/product" element={<Product />} />
            <Route path="/product/add" element={<ProductAdd />} />
            <Route path="/product/update/:id" element={<ProductUpdate />} />

              {/* Categogy*/}
            <Route path="/categogy" element={<Categogy />} />
            <Route path="/categogy/add" element={<CategogyAdd />} />
            <Route path="/categogy/update/:id" element={<CategogyUpdate />} />

            {/* voucher*/}
            <Route path="/voucher" element={<Voucher />} />
             <Route path="/order" element={<Order />} />
            {/* <Route path="/categogy/add" element={<CategogyAdd />} />
            <Route path="/categogy/update/:id" element={<CategogyUpdate />} /> */}
            {/* flashSale*/}
            <Route path="/flash-sale" element={<FlashSales />} />
            <Route path="/flash-sale/add" element={<FlashSaleAdd />} />
            <Route path="/flash-sale/update/:id" element={<FlashSaleUpdate />} />
              {/* flashSale*/}
            <Route path="/flashsale-products" element={<FlashSaleProduct/>} />
            <Route path="/flashsale-products/add" element={<FlashSaleProductAdd />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
