import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { colorMap } from "./ColorMap";
import "../CSS/trangchitiet.css";

const extractOptions = (materials) => {
  if (!materials || materials.length === 0)
    return { availableColors: [], availableSizes: [] };

  const colors = new Set();
  const sizes = new Set();

  materials.forEach((m) => {
    if (m.color) colors.add(m.color);
    if (m.size) sizes.add(m.size);
  });

  return {
    availableColors: Array.from(colors),
    availableSizes: Array.from(sizes),
  };
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
  const [currentStock, setCurrentStock] = useState(0);

  const [flashSales, setFlashSales] = useState([]);
  const [timer, setTimer] = useState(0);

  const [showPreOrderForm, setShowPreOrderForm] = useState(false);
  const [preOrderData, setPreOrderData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [preOrderLoading, setPreOrderLoading] = useState(false);

  // ========================================
  // 1. Fetch dữ liệu sản phẩm + materials
  // ========================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/slug/${slug}`);
        if (!res.ok) throw new Error("Không thể lấy dữ liệu sản phẩm");
        const data = await res.json();

        if (data && data.product_id) {
          let materials = [];
          try {
            const resMat = await fetch(
              `http://localhost:5000/api/product-materials/${data.product_id}`
            );
            if (resMat.ok) {
              const matData = await resMat.json();
              materials = Array.isArray(matData) ? matData : matData.materials || [];
            }
          } catch (err) {
            console.error("Lỗi fetch materials:", err);
          }

          const { availableColors, availableSizes } = extractOptions(materials);
          let defaultVariant = materials.length > 0 ? materials[0] : null;

          setProduct({
            ...data,
            materials,
            availableColors,
            availableSizes,
          });

          if (defaultVariant) {
            setSelectedColor(defaultVariant.color || null);
            setSelectedSize(defaultVariant.size || null);
            setDisplayImage(defaultVariant.image || data.image);
            setCurrentStock(defaultVariant.stock || 0);
            setQuantity(1); // mặc định 1 lần đầu fetch
          } else {
            setDisplayImage(data.image);
            setCurrentStock(data.stock || 0);
            setQuantity(1);
          }
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
  // 2. Cập nhật stock khi chọn color/size
  // ========================================
  useEffect(() => {
    if (!product) return;

    if (product.materials && product.materials.length > 0) {
      const found = product.materials.find(
        (m) =>
          (!selectedColor || m.color === selectedColor) &&
          (!selectedSize || m.size === selectedSize)
      );

      if (found) {
        setCurrentStock(found.stock);
        return;
      }
    }

    setCurrentStock(product.stock);
  }, [product, selectedColor, selectedSize]);

  // ========================================
  // 3. Flash sale
  // ========================================
  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/flash-sale/active");
        if (!res.ok) throw new Error("Không thể lấy flash sale");
        const data = await res.json();

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

  // Countdown
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

  const getBestFlashSale = (product) => {
    if (!product) return null;
    const sales = flashSales.filter(
      (fs) => fs.product_id === product.product_id && fs.end_at > new Date()
    );
    if (sales.length === 0) return null;
    return sales.reduce((best, curr) =>
      curr.sale_price < best.sale_price ? curr : best
    );
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleColorSelect = (color) => {
    if (!product) return;
    if (selectedColor === color) return;

    setSelectedColor(color);
    setSelectedSize(null); // reset size khi đổi màu

    const found = product.materials?.find(
      (m) => m.color === color && m.image && m.image.trim() !== ""
    );

    if (found) {
      setDisplayImage(found.image);
      setCurrentStock(found.stock || 0);
    } else {
      setDisplayImage((prev) => prev);
      setCurrentStock(product.stock || 0);
    }

    setQuantity(1); // reset quantity khi đổi variant
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);

    const found = product.materials?.find(
      (m) =>
        m.size === size &&
        (!selectedColor || m.color === selectedColor)
    );

    if (found) {
      setCurrentStock(found.stock);
    } else {
      setCurrentStock(product.stock);
    }

    setQuantity(1); // reset quantity khi đổi variant
  };

  // ========================================
  // 🛒 Thêm vào giỏ
  // ========================================
  const handleAddToCart = () => {
    if (!product) return;
    if (product.availableColors?.length > 0 && !selectedColor) {
      alert("Vui lòng chọn màu sắc trước khi thêm vào giỏ hàng!");
      return;
    }
    if (product.availableSizes?.length > 0 && !selectedSize) {
      alert("Vui lòng chọn kích cỡ trước khi thêm vào giỏ hàng!");
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
  // 📦 Đặt hàng trước
  // ========================================
  const handlePreOrder = () => {
    setShowPreOrderForm(true);
  };

  const handlePreOrderSubmit = async (e) => {
    e.preventDefault();
    setPreOrderLoading(true);
    try {
      const price = getBestFlashSale(product)
        ? getBestFlashSale(product).sale_price
        : Number(product.price);

      const total = price * quantity;

      const fullProductName = `${product.name}${selectedSize ? " - " + selectedSize : ""}${selectedColor ? " - " + selectedColor : ""}`;

      const res = await fetch("http://localhost:5000/api/preorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.product_id,
          product_name: fullProductName,
          price,
          quantity,
          total_amount: total,
          color: selectedColor || null,
          size: selectedSize || null,
          customer_name: preOrderData.name,
          phone: preOrderData.phone,
          address: preOrderData.address,
          note: preOrderData.note,
        }),
      });

      if (!res.ok) throw new Error("Đặt hàng trước thất bại!");
      const data = await res.json();
      alert("📦 Đặt hàng trước thành công! Mã đơn #" + data.preorder_id);
      setShowPreOrderForm(false);
      setPreOrderData({ name: "", phone: "", address: "", note: "" });
      setQuantity(1);
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setPreOrderLoading(false);
    }
  };

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
                <span className="old-price">
                  {Number(product.price).toLocaleString("vi-VN")} VNĐ
                </span>
                <span className="sale-price">
                  {Number(displayPrice).toLocaleString("vi-VN")} VNĐ
                </span>
              </>
            ) : (
              <span>{Number(displayPrice).toLocaleString("vi-VN")} VNĐ</span>
            )}
          </p>

          {isFlashActive && <p className="countdown">Còn lại: {formatTime(timer)}</p>}

          <p>{product.description}</p>

          {/* Màu sắc */}
          {product.availableColors?.length > 0 && (
            <div className="product-options">
              <label>Màu sắc:</label>
              <div className="option-chips">
                {product.availableColors.map((color) => (
                  <span
                    key={color}
                    className={`color-chip ${selectedColor === color ? "active" : ""}`}
                    style={{
                      backgroundColor: colorMap[color] || "#fff",
                      border: selectedColor === color ? "2px solid #000" : "1px solid #ccc",
                    }}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
            </div>
          )}

        {/* Kích cỡ */}
        {product.availableSizes?.length > 0 && (
          <div className="product-options">
            <label>Kích cỡ:</label>
            <div className="option-chips">
              {product.availableSizes
                .filter((size) => {
                  if (selectedColor) {
                    return product.materials.some(
                      (m) => m.size === size && m.color === selectedColor
                    );
                  }
                  return true;
                })
                .sort((a, b) => {
                  // Nếu size là số (ví dụ 42, 43, 44...)
                  const numA = Number(a);
                  const numB = Number(b);
                  if (!isNaN(numA) && !isNaN(numB)) return numA - numB;

                  // Nếu size là chữ (S, M, L...) dùng orderMap
                  const orderMap = { XS: 1, S: 2, M: 3, L: 4, XL: 5, XXL: 6 };
                  return (orderMap[a] || 99) - (orderMap[b] || 99);
                })
                .map((size) => (
                  <button
                    key={size}
                    className={`size-chip ${selectedSize === size ? "active" : ""}`}
                    onClick={() => handleSizeSelect(size)}
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
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <p>Tồn kho: {currentStock}</p>

          {currentStock > 0 ? (
            <button onClick={handleAddToCart} className="add-to-cart-btn">
              🛒 Thêm vào giỏ
            </button>
          ) : (
            <button onClick={handlePreOrder} className="preorder-btn">
              📦 Đặt hàng trước
            </button>
          )}
        </div>
      </div>

      {/* 📝 Form Preorder Popup */}
      {showPreOrderForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              Đặt hàng trước: {product.name}
              {selectedColor && ` - ${selectedColor}`}
              {selectedSize && ` - ${selectedSize}`}
            </h3>
            <form onSubmit={handlePreOrderSubmit}>
              <label>Họ tên *</label>
              <input
                type="text"
                required
                value={preOrderData.name}
                onChange={(e) =>
                  setPreOrderData({ ...preOrderData, name: e.target.value })
                }
              />

              <label>Số điện thoại *</label>
              <input
                type="text"
                required
                value={preOrderData.phone}
                onChange={(e) =>
                  setPreOrderData({ ...preOrderData, phone: e.target.value })
                }
              />

              <label>Địa chỉ</label>
              <textarea
                value={preOrderData.address}
                onChange={(e) =>
                  setPreOrderData({ ...preOrderData, address: e.target.value })
                }
              />

              <label>Ghi chú</label>
              <textarea
                value={preOrderData.note}
                onChange={(e) =>
                  setPreOrderData({ ...preOrderData, note: e.target.value })
                }
              />

              <div className="modal-actions">
                <button type="button" onClick={() => setShowPreOrderForm(false)}>
                  ❌ Hủy
                </button>
                <button type="submit" disabled={preOrderLoading}>
                  {preOrderLoading ? "Đang gửi..." : "📦 Gửi đặt hàng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
