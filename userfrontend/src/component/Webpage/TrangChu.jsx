import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import '../CSS/trangchu.css';
import BannerCarousel from "./BannerCarousel";
import ProductFilter from './ProductFilter';
import NewestProductsSlider from "./NewestProductsSlider";
import CategorySelectorSlider from "./CategorySelectorSlider";
import VoucherInput from "./VoucherInput";
import axios from "axios";

const normalizeText = (text) => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '');
};

const TrangChu = () => {
    // Của categories selector của sản phẩm mới nhất
    const [categories, setCategories] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState(null);

    const [products, setProducts] = useState([]);
    const [flashSales, setFlashSales] = useState([]);
    const [timer, setTimer] = useState({});
    const [sortOption, setSortOption] = useState("default");
    const [activeVoucher, setActiveVoucher] = useState(null);

    const [latestNews, setLatestNews] = useState([]);

    const location = useLocation();
    const searchQuery = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get('search') || '';
    }, [location.search]);

    // Lấy 4 news mới nhất
    useEffect(() => {
        axios.get("http://localhost:5000/api/news/latest")
            .then(res => {
                console.log("API response:", res.data); // ✅ Add this inside the .then
                setLatestNews(res.data);
            })
            .catch(err => console.error("Lỗi khi lấy tin tức mới:", err));
    }, []);

    // Lấy categories cho categories selector
    useEffect(() => {
        fetch("http://localhost:5000/api/category")
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
                if (data.length > 0) {
                    setSelectedSlug(data[0].slug);
                }
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    // Lấy danh sách sản phẩm
    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    // Lấy flash sale đang active
    useEffect(() => {
        fetch("http://localhost:5000/api/flash-sale/active")
            .then(res => res.json())
            .then(data => setFlashSales(data))
            .catch(err => console.error("Error fetching flash sales:", err));
    }, []);

    const getSalePrice = (productId, originalPrice) => {
        const applicableSales = flashSales.filter(flash =>
            flash.products.some(p => p.product_id === productId)
        );

        if (applicableSales.length === 0) {
            return { price: originalPrice, isFlash: false, end_at: null };
        }

        const bestSale = applicableSales.reduce((prev, curr) =>
            prev.discount_value > curr.discount_value ? prev : curr
        );

        let salePrice;
        if (bestSale.discount_type === "percent") {
            salePrice = Math.round(originalPrice * (100 - bestSale.discount_value) / 100);
        } else if (bestSale.discount_type === "fixed") {
            salePrice = originalPrice - bestSale.discount_value;
        } else {
            salePrice = originalPrice;
        }

        return { price: salePrice, isFlash: true, end_at: bestSale.end_at };
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    // Lọc & sắp xếp sản phẩm
    const productsToDisplay = useMemo(() => {
        let filtered = [...products];

        if (searchQuery) {
            const normalizedQuery = normalizeText(searchQuery);
            filtered = filtered.filter(product => {
                const normalizedName = normalizeText(product.name);
                return normalizedName.includes(normalizedQuery);
            });
        }

        switch (sortOption) {
            case "gia-cao-thap":
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "gia-thap-cao":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "giamgia":
                filtered.sort((a, b) => {
                    const saleA = flashSales.some(flash => flash.products.some(p => p.product_id === a.product_id));
                    const saleB = flashSales.some(flash => flash.products.some(p => p.product_id === b.product_id));
                    return (saleB ? 1 : 0) - (saleA ? 1 : 0);
                });
                break;
            case "banchay":
                filtered.sort((a, b) => (b.sold || 0) - (a.sold || 0));
                break;
            case "moi":
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            default:
                break;
        }

        return filtered;
    }, [products, searchQuery, sortOption, flashSales]);

    // Tính giá cuối cùng áp voucher
    const applyVoucher = (price, product) => {
        if (!activeVoucher) return price;
        // nếu có category_id áp dụng
        if (activeVoucher.category_id && activeVoucher.category_id !== product.category_id) return price;

        if (activeVoucher.discount_type === "percent") {
            return Math.round(price * (100 - activeVoucher.discount_value) / 100);
        } else {
            return price - activeVoucher.discount_value;
        }
    };

    return (
        <div className="content">
            <BannerCarousel />

            <div className="customer-benefits-wrapper">
                <div className="customer-benefit-box">
                    <img src={`http://localhost:5000/images/benefit1.png`} alt="Nationwide Delivery" className="benefit-icon" />
                    <p>Vận chuyển <strong>TOÀN QUỐC</strong><br />Thanh toán khi nhận hàng</p>
                </div>
                <div className="customer-benefit-box">
                    <img src={`http://localhost:5000/images/benefit2.png`} alt="Quality Assurance" className="benefit-icon" />
                    <p><strong>Bảo đảm chất lượng</strong><br />Sản phẩm hoàn toàn chính hãng</p>
                </div>
                <div className="customer-benefit-box">
                    <img src={`http://localhost:5000/images/benefit3.png`} alt="Fast Payment" className="benefit-icon" />
                    <p>Tiết kiệm <strong>THỜI GIAN</strong><br />Với nhiều PHƯƠNG THỨC</p>
                </div>
                <div className="customer-benefit-box">
                    <img src={`http://localhost:5000/images/benefit4.png`} alt="Product Exchange" className="benefit-icon" />
                    <p><strong>Đổi sản phẩm mới</strong><br />Nếu sản phẩm lỗi</p>
                </div>
            </div>

            {!searchQuery && selectedSlug && (
                <>
                    <div className="title-head">SẢN PHẨM MỚI</div>
                    <CategorySelectorSlider
                        selectedSlug={selectedSlug}
                        onSelect={setSelectedSlug}
                        categories={categories}
                    />
                    <NewestProductsSlider slug={selectedSlug} />
                </>
            )}

            {/* Ô nhập voucher */}
            <VoucherInput onVoucherApplied={setActiveVoucher} />

            <div className="title-head">
                {searchQuery
                    ? `KẾT QUẢ TÌM KIẾM CHO: "${searchQuery}" (${productsToDisplay.length} sản phẩm)`
                    : "SẢN PHẨM NỔI BẬT"}
            </div>

            <ProductFilter
                onSortChange={setSortOption}
                sortOption={sortOption}
            />

            <div className="product-container">
                <div className="card-container">
                    {productsToDisplay.length > 0 ? (
                        productsToDisplay.map(product => {
                            const { price: salePrice, isFlash, end_at } = getSalePrice(product.product_id, product.price);
                            const finalPrice = applyVoucher(salePrice, product);

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
                                                {(finalPrice < product.price) ? (
                                                    <>
                                                        <span className="old-price">
                                                            {Number(product.price).toLocaleString('vi-VN')} VNĐ
                                                        </span>
                                                        <span className="sale-price">
                                                            {Number(finalPrice).toLocaleString('vi-VN')} VNĐ
                                                        </span>
                                                    </>
                                                ) : isFlash ? (
                                                    <>
                                                        <span className="old-price">
                                                            {Number(product.price).toLocaleString('vi-VN')} VNĐ
                                                        </span>
                                                        <span className="sale-price">
                                                            {Number(finalPrice).toLocaleString('vi-VN')} VNĐ
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span>{Number(finalPrice).toLocaleString('vi-VN')} VNĐ</span>
                                                )}
                                            </p>
                                            {isFlash && end_at && timer[product.product_id] > 0 && (
                                                <p className="countdown">{formatTime(timer[product.product_id])}</p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div style={{ padding: '20px', width: '100%', textAlign: 'center' }}>
                            Không tìm thấy sản phẩm nào phù hợp.
                        </div>
                    )}
                </div>
            </div>
            <section id="latest-news">
                <div className="title-head">TIN TỨC MỚI</div>
                <div className="news-grid">
                    {latestNews.map(news => (
                        <div className="news-box" key={news.news_id}>
                            <div className="thumbnail-frame">
                                <img
                                    src={`http://localhost:5000/images/${news.image}`}
                                    alt={news.title}
                                    className="thumbnail-img"
                                />
                            </div>
                            <div className="news-content">
                                <h3 className="news-title">{news.title}</h3>
                                <div className="news-published">
                                    <span className="line"></span>
                                    <span className="time-label">
                                        {new Date(news.published_at).toLocaleDateString("vi-VN")}
                                    </span>
                                    <span className="line"></span>
                                </div>
                                <p className="news-snippet">
                                    {news.content.length > 150
                                        ? news.content.slice(0, 150) + "..."
                                        : news.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default TrangChu;
