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
import ProductMaterials from "./component/ProductMaterial";
import ProductMaterialAdd from "./component/ProductMaterialAdd";
import AdminLogin from "./component/AdminLogin";
import Category from "./component/Category";
import CategoryAdd from "./component/CategoryAdd";
import CategoryUpdate from "./component/CategoryUpdate";
import Voucher from "./component/VoucherAdmin";
import VoucherAdd from "./component/VoucherAdminAdd";
import VoucherUpdate from "./component/VoucherAdminUpdate";
import Order from "./component/Order";
import OrderUpdate from "./component/OrderUpdate";
import FlashSales from "./component/FlashSale";
import FlashSaleAdd from "./component/FlashSaleAdd";
import FlashSaleUpdate from "./component/FlashSaleUpdate";
import FlashSaleProduct from "./component/FlashSaleProduct";
import FlashSaleProductAdd from "./component/FlashSaleProductAdd";
import FlashSaleProductUpdate from "./component/FlashSaleProductUpdate";
import NewsAdmin from "./component/NewsAdmin";
import NewsAdminAdd from "./component/NewsAdminAdd";
import NewsAdminUpdate from "./component/NewsAdminUpdate";
import NewsCategoryAdmin from "./component/NewsCategoryAdmin";
import NewsCategoryAdminAdd from "./component/NewCategoryAdminAdd";
import NewsCategoryAdminUpdate from "./component/NewCategoryAdminUpdate";
import Brand from "./component/Brand";
import BrandAdd from "./component/BrandAdd";
import BrandUpdate from "./component/BrandUpdate";
import PagesAdmin from "./component/PagesAdmin";
import ProductReview from "./component/ProductReview";
import Feedback from "./component/Feedback";
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
            
             {/* ProductMaterial */}
            <Route path="/product-material" element={<ProductMaterials />} />
            <Route path="/product-material/add" element={<ProductMaterialAdd />} />
            {/* <Route path="/product/update/:id" element={<ProductUpdate />} /> */}
            {/* Brand */}
            <Route path="/brand" element={<Brand />} />
            <Route path="/brand/add" element={<BrandAdd />} />
            <Route path="/brand/update/:id" element={<BrandUpdate />} />
              {/* Category*/}
            <Route path="/category" element={<Category />} />
            <Route path="/category/add" element={<CategoryAdd />} />
            <Route path="/category/update/:id" element={<CategoryUpdate />} />

            {/* voucher*/}
            <Route path="/voucher" element={<Voucher />} />
            <Route path="/voucher/add" element={<VoucherAdd />} />
            <Route path="/voucher/update/:id" element={<VoucherUpdate />} />

            
            <Route path="/order" element={<Order />} />
            <Route path="/order/update/:id" element={<OrderUpdate />} />
            {/* <Route path="/category/add" element={<CategoryAdd />} />
            <Route path="/category/update/:id" element={<CategoryUpdate />} /> */}
            {/* flashSale*/}
            <Route path="/flash-sale" element={<FlashSales />} />
            <Route path="/flash-sale/add" element={<FlashSaleAdd />} />
            <Route path="/flash-sale/update/:id" element={<FlashSaleUpdate />} />
              {/* flashSale*/}
            <Route path="/flash-sale-products" element={<FlashSaleProduct/>} />
            <Route path="/flash-sale-products/add" element={<FlashSaleProductAdd />} />
            <Route path="/flash-sale-products/update/:id" element={<FlashSaleProductUpdate />} />
            {/* News */}
            <Route path="/news" element={<NewsAdmin/>} />
            <Route path="/news/add" element={<NewsAdminAdd/>} />
            <Route path="/news/update/:id" element={<NewsAdminUpdate/>} />

             {/* NewsCategory */}
            <Route path="/news-category" element={<NewsCategoryAdmin/>} />
            <Route path="/news-category/add" element={<NewsCategoryAdminAdd />} />
            <Route path="/news-category/update/:id" element={<NewsCategoryAdminUpdate />} />
            
            <Route path="/product-reviews" element={<ProductReview/>} />
            <Route path="/Feedback" element={<Feedback/>} />
            <Route path="/pages" element={<PagesAdmin/>} />
            
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
