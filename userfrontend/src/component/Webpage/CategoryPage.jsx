import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../CSS/trangchu.css";

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategory] = useState([]);
  const [flashSales, setFlashSales] = useState([]);
  const [timer, setTimer] = useState({});
  const [activeVoucher, setActiveVoucher] = useState(null); // ✅ voucher hiện tại

  // ✅ Khi trang load, lấy voucher đã lưu từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("appliedVoucher");
    if (saved) {
      setActiveVoucher(JSON.parse(saved));
    }
  }, []);

  // ✅ Lấy tên danh mục theo slug
  useEffect(() => {
    fetch(`http://localhost:5000/api/category/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          setCategory(data.name);
        } else {
          setCategory("Danh Mục");
        }
      })
      .catch((err) => console.error("Lỗi khi fetch tên danh mục:", err));
  }, [slug]);

  // ✅ Lấy danh sách sản phẩm theo danh mục
  useEffect(() => {
    fetch(`http://localhost:5000/api/products/category/${slug}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching category products:", err));
  }, [slug]);

  // ✅ Lấy flash sale active
  useEffect(() => {
    fetch("http://localhost:5000/api/flash-sale/active")
      .then((res) => res.json())
      .then((data) => setFlashSales(data))
      .catch((err) => console.error("Error fetching flash sales:", err));
  }, []);

  // ✅ Countdown Flash Sale
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimer = {};
      flashSales.forEach((flash) => {
        flash.products.forEach((p) => {
          const diff = new Date(flash.end_at) - new Date();
          newTimer[p.product_id] = diff > 0 ? diff : 0;
        });
      });
      setTimer(newTimer);
    }, 1000);

    return () => clearInterval(interval);
  }, [flashSales]);

  // ✅ Tính giá flash sale
  const getSalePrice = (productId, originalPrice) => {
    const applicableSales = flashSales.filter((flash) =>
      flash.products.some((p) => p.product_id === productId)
    );

    if (applicableSales.length === 0) {
      return { price: originalPrice, isFlash: false, end_at: null };
    }

    const bestSale = applicableSales.reduce((prev, curr) =>
      prev.discount_value > curr.discount_value ? prev : curr
    );

    let salePrice;
    if (bestSale.discount_type === "percent") {
      salePrice = Math.round(
        originalPrice * (100 - bestSale.discount_value) / 100
      );
    } else if (bestSale.discount_type === "fixed") {
      salePrice = originalPrice - bestSale.discount_value;
    } else {
      salePrice = originalPrice;
    }

    return { price: salePrice, isFlash: true, end_at: bestSale.end_at };
  };

  // ✅ Format thời gian countdown
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // ✅ Tính giá sau khi áp dụng voucher
  const applyVoucher = (price, product) => {
    if (!activeVoucher) return price;
    if (activeVoucher.category_id && activeVoucher.category_id !== product.category_id)
      return price;

    if (activeVoucher.discount_type === "percent") {
      return Math.round(price * (100 - activeVoucher.discount_value) / 100);
    } else {
      return price - activeVoucher.discount_value;
    }
  };

  return (
    <div className="content">
      <h1 className="title-head">{categoryName}</h1>

      <div className="product-container">
        <div className="card-container">
          {products.length > 0 ? (
            products.map((product) => {
              const { price: salePrice, isFlash, end_at } = getSalePrice(
                product.product_id,
                product.price
              );
              const finalPrice = applyVoucher(salePrice, product);

              const isVoucherApplied = activeVoucher && finalPrice < salePrice;

              return (
                <Link
                  key={product.product_id}
                  to={`/product/${product.slug}`}
                  className="product-link"
                >
                  <div className="product-card">
                    <img
                      src={`http://localhost:5000/images/${product.image}`}
                      alt={product.name}
                    />

                    {isFlash && <div className="flash-badge">FLASH SALE</div>}

                    <div className="product-info">
                      <p className="product-name">{product.name}</p>

                      <p className="product-price">
                        {isFlash || isVoucherApplied ? (
                          <>
                            <span className="old-price">
                              {Number(product.price).toLocaleString("vi-VN")} VNĐ
                            </span>
                            <span className="sale-price">
                              {Number(finalPrice).toLocaleString("vi-VN")} VNĐ
                            </span>
                          </>
                        ) : (
                          <span>
                            {Number(product.price).toLocaleString("vi-VN")} VNĐ
                          </span>
                        )}
                      </p>

                      {isFlash && end_at && timer[product.product_id] > 0 && (
                        <p className="countdown">
                          {formatTime(timer[product.product_id])}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p>Không có sản phẩm nào</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
