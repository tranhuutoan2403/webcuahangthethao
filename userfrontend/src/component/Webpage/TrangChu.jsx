import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../CSS/trangchu.css';

const TrangChu = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products") // gọi API Node.js
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="content">
      {/* Banner */}
      <div className="poster">
        <img
         src="http://localhost:5000/images/banner.jpg" alt="Poster"
        />
      </div>

      {/* Tiêu đề */}
      <div className="title-head">SẢN PHẨM NỔI BẬT</div>

      {/* Danh sách sản phẩm */}
      <div className="product-container">
        <div className="card-container">
          {products.map(product => (
            <Link
              key={product.product_id}
              to={`/product/${product.slug}`}
              className="product-link"
            >
              <div className="product-card">
            <img src={`http://localhost:5000/images/${product.image}`} alt={product.name} />
                <div className="product-info">
                  <p className="product-name">{product.name}</p>
                  <p className="product-price">
                    {Number(product.price).toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrangChu;
