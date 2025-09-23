import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../CSS/trangchitiet.css";

// Hàm tiện ích để trích xuất màu sắc và kích cỡ duy nhất từ mảng materials
const extractOptions = (materials) => {
  if (!materials || materials.length === 0) return { availableColors: [], availableSizes: [] };
  const colors = new Set();
  const sizes = new Set();
  materials.forEach((m) => {
    if (m.color) colors.add(m.color);
    if (m.size) sizes.add(m.size);
  });
  return { availableColors: Array.from(colors), availableSizes: Array.from(sizes) };
};

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [displayImage, setDisplayImage] = useState("");

  const [flashSales, setFlashSales] = useState([]); // mảng tất cả flash sale
  const [timer, setTimer] = useState(0); // countdown cho flash sale tốt nhất

  // ========================================
  // 1. Fetch dữ liệu sản phẩm
  // ========================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/slug/${slug}`);
        if (!res.ok) throw new Error("Không thể lấy dữ liệu sản phẩm");
        const data = await res.json();

        if (data && data.product_id) {
          const { availableColors, availableSizes } = extractOptions(data.materials);
          setProduct({
            ...data,
            availableColors,
            availableSizes,
          });
          setDisplayImage(data.image);
          if (availableSizes.length > 0) setSelectedSize(availableSizes[0]);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // ========================================
  // 2. Fetch tất cả flash sale
  // ========================================
  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/flash-sale/active");
        if (!res.ok) throw new Error("Không thể lấy flash sale");
        const data = await res.json(); // mảng flash sale

        // chuyển thành dạng mảng { product_id, sale_price, end_at }
        const sales = [];
        data.forEach((fs) => {
          fs.products.forEach((p) => {
            sales.push({
              product_id: p.product_id,
              sale_price: p.sale_price,
              end_at: new Date(fs.end_at),
            });
          });
        });

        setFlashSales(sales);
      } catch (err) {
        console.error("Lỗi fetch flash sale:", err);
      }
    };
    fetchFlashSales();
  }, []);

  // ========================================
  // 3. Countdown timer cho flash sale tốt nhất
  // ========================================
  useEffect(() => {
    const interval = setInterval(() => {
      if (!product) return;

      const bestFlash = getBestFlashSale(product);
      if (bestFlash) {
        const diff = bestFlash.end_at - new Date();
        setTimer(diff > 0 ? diff : 0);
      } else {
        setTimer(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [flashSales, product]);

  // ========================================
  // 4. Lấy flash sale tốt nhất cho sản phẩm
  // ========================================
  const getBestFlashSale = (product) => {
    if (!product) return null;

    const sales = flashSales.filter(
      (fs) => fs.product_id === product.product_id && fs.end_at > new Date()
    );
    if (sales.length === 0) return null;

    // Giảm giá cao nhất = sale_price thấp nhất
    return sales.reduce((best, curr) => (curr.sale_price < best.sale_price ? curr : best), sales[0]);
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // ========================================
  // 5. Xử lý chọn màu
  // ========================================
  const handleColorSelect = (color) => {
    if (!product) return;
    if (selectedColor === color) {
      setSelectedColor(null);
      setDisplayImage(product.image);
      return;
    }
    setSelectedColor(color);
    const found = product.materials?.find((m) => m.color === color && m.image && m.image.trim() !== "");
    setDisplayImage(found ? found.image : product.image);
  };

  // ========================================
  // 6. Thêm vào giỏ hàng
  // ========================================
  const handleAddToCart = () => {
    if (!product) return;
    if (product.availableColors?.length > 0 && !selectedColor) {
      alert("Vui lòng chọn màu sắc trước khi thêm vào giỏ hàng!");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const variantKey = `${product.product_id}-${selectedColor || "NoColor"}-${selectedSize || "NoSize"}`;
    const existingIndex = cart.findIndex((item) => item.variantKey === variantKey);

    const bestFlash = getBestFlashSale(product);
    const price = bestFlash ? bestFlash.sale_price : Number(product.price);

    const cartItem = {
      productId: product.product_id,
      name: product.name,
      price,
      quantity,
      image: displayImage,
      color: selectedColor,
      size: selectedSize,
      variantKey,
    };

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/giohang");
  };

  // ========================================
  // 7. JSX hiển thị
  // ========================================
  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  const bestFlash = getBestFlashSale(product);
  const isFlashActive = bestFlash !== null;
  const displayPrice = isFlashActive ? bestFlash.sale_price : Number(product.price);

  return (
    <div className="container">
      <h2>Chi Tiết Sản Phẩm: {product.name}</h2>
      <div className="product-align">
        <img
          src={`http://localhost:5000/images/${displayImage}`}
          alt={product.name}
          style={{ width: "700px" }}
        />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>
            Giá:{" "}
            {isFlashActive ? (
              <>
                <span className="old-price">{Number(product.price).toLocaleString("vi-VN")} VNĐ</span>
                <span className="sale-price">{Number(displayPrice).toLocaleString("vi-VN")} VNĐ</span>
              </>
            ) : (
              <span>{Number(displayPrice).toLocaleString("vi-VN")} VNĐ</span>
            )}
          </p>

          {isFlashActive && <p className="countdown">Còn lại: {formatTime(timer)}</p>}

          <p>{product.description}</p>

          {/* Chọn màu */}
          {product.availableColors?.length > 0 && (
            <div className="product-options">
              <label>Màu sắc:</label>
              <div className="option-chips">
                {product.availableColors.map((color) => (
                  <span
                    key={color}
                    className={`color-chip ${selectedColor === color ? "active" : ""}`}
                    style={{
                      backgroundColor: color.toLowerCase(),
                      border: selectedColor === color ? "2px solid #000" : "1px solid #ccc",
                    }}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Chọn size */}
          {product.availableSizes?.length > 0 && (
            <div className="product-options">
              <label>Kích cỡ:</label>
              <div className="option-chips">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`size-chip ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Số lượng */}
          <div className="quantity-group">
            <label>Số lượng:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <button onClick={handleAddToCart} className="add-to-cart-btn">
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
