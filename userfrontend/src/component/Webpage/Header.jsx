import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../CSS/header.css';
import { Link, useNavigate } from 'react-router-dom';

// ✅ Hàm Debounce để tránh gọi API liên tục khi gõ nhanh
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// ✅ Hàm chuẩn hóa chuỗi (bỏ dấu, bỏ khoảng trắng)
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
};

export default function Header() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  // ✅ Lấy user từ localStorage
  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    updateUser();
    window.addEventListener('userChanged', updateUser);
    return () => window.removeEventListener('userChanged', updateUser);
  }, []);

  // ✅ Lấy danh sách sản phẩm để gợi ý
  useEffect(() => {
    fetch('http://localhost:5000/api/products?fields=name,slug')
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.error('Lỗi lấy sản phẩm:', err));
  }, []);

  // ✅ Ẩn gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Hàm lọc gợi ý
  const handleSuggest = useCallback(
    (query) => {
      if (query.length < 1) {
        setSuggestions([]);
        return;
      }
      const normalizedQuery = normalizeText(query);
      const filtered = allProducts
        .filter((product) =>
          normalizeText(product.name).includes(normalizedQuery)
        )
        .slice(0, 6);
      setSuggestions(filtered);
    },
    [allProducts]
  );

  const debouncedSuggest = useRef(debounce(handleSuggest, 300)).current;

  // ✅ Khi gõ vào ô input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);
    debouncedSuggest(value);
  };

  // ✅ Khi bấm Enter hoặc nút tìm kiếm
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    const query = searchTerm.trim();
    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/');
    }
  };

  // ✅ Khi bấm vào 1 gợi ý
  const handleSuggestionClick = (slug, name) => {
    setSearchTerm(name);
    setShowSuggestions(false);
    navigate(`/product/${slug}`);
  };

  // ✅ Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('userChanged'));
    navigate('/');
  };

  return (
    <header className="header">
      <div className="top-border"></div>

      <div className="header-main">
        <div className="container">
          <div className="header-content">

            {/* Logo */}
            <div className="logo">
              <Link to="/">
                <img src="http://localhost:5000/images/logo.jpg" alt="Logo" />
              </Link>
            </div>

            {/* MENU CHÍNH */}
            <nav className="nav">
              <div className="dropdown">
                <Link to="/news/ve-chung-toi">Về Chúng Tôi</Link>
              </div>

              {/* <div className="dropdown">
                <button>NHÃN HIỆU ▾</button>
                <div className="dropdown-menu">
                  <Link to="/category/yonex">Yonex</Link>
                  <Link to="/category/lining">Lining</Link>
                </div>
              </div> */}

              {/* ✅ Menu category + brand */}
              <div className="dropdown">
                <Link to="/category/vot-cau-long">Vợt Cầu Lông</Link>
                <div className="dropdown-menu">
                  <Link to="/vot-cau-long/yonex">Yonex</Link>
                  <Link to="/vot-cau-long/lining">Lining</Link>
                </div>
              </div>

              <div className="dropdown">
                <Link to="/category/vot-pickle-ball">Vợt PickleBall</Link>
                <div className="dropdown-menu">
                  <Link to="/vot-pickle-ball/head">Head</Link>
                  <Link to="/vot-pickle-ball/joola">Joola</Link>
                </div>
              </div>

              <div className="dropdown">
                <Link to="/vot-tennis">Vợt Tennis</Link>
                <div className="dropdown-menu">
                  <Link to="/vot-tennis/head">Head</Link>
                  <Link to="/vot-tennis/joola">Joola</Link>
                </div>
              </div>

              <div className="dropdown">
                <Link to="/category/giay-cau-long">Giày</Link>
                <div className="dropdown-menu">
                  <Link to="/giay-cau-long/yonex">Yonex</Link>
                  <Link to="/giay-cau-long/lining">Lining</Link>
                </div>
              </div>

              <div className="dropdown">
                <Link to="/news/category/tin-tuc">Tin Tức</Link>
              </div>
            </nav>

            {/* PHẦN BÊN PHẢI */}
            <div className="right-section">

              {/* Ô tìm kiếm */}
              <div className="search-box-wrapper" ref={searchRef}>
                <form className="search-box" onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="Bạn cần tìm gì..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => searchTerm.length > 0 && handleSuggest(searchTerm)}
                  />
                  <button type="submit">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </form>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="search-suggestions">
                    {suggestions.map((product) => (
                      <div
                        key={product.slug}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(product.slug, product.name)}
                      >
                        {product.name}
                      </div>
                    ))}
                    <div
                      className="suggestion-item search-full"
                      onClick={handleSearchSubmit}
                    >
                      Tìm kiếm đầy đủ cho “{searchTerm}”
                    </div>
                  </div>
                )}
              </div>

              {/* Tài khoản */}
              <div className="account-dropdown">
                <div className="user-info">
                  <i className="fa-regular fa-user user-icon"></i>
                  {user && <span className="username"><strong>{user.username}</strong></span>}
                </div>
                <div className="dropdown-menu1">
                  {user ? (
                    <>
                      <Link to="/profile" className="dropdown-item">Trang Cá Nhân</Link>
                      <Link to="/My-order" className="dropdown-item">Đơn hàng của tôi</Link>
                      <span onClick={handleLogout} className="dropdown-item logout">Đăng Xuất</span>
                    </>
                  ) : (
                    <>
                      <Link to="/register" className="dropdown-item">Đăng Ký</Link>
                      <Link to="/login" className="dropdown-item">Đăng Nhập</Link>
                    </>
                  )}
                </div>
              </div>

              {/* Giỏ hàng */}
              <Link to="/giohang" className="icon badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6h15l-1.5 9h-12L6 6z" />
                  <path d="M6 6L4 3" />
                </svg>
                <span className="badge-count">0</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
