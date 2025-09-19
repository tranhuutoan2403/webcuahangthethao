import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../CSS/trangchitiet.css";

// Hàm tiện ích để trích xuất màu sắc và kích cỡ duy nhất từ mảng materials
const extractOptions = (materials) => {
    if (!materials || materials.length === 0) {
        return { availableColors: [], availableSizes: [] };
    }
    const colors = new Set();
    const sizes = new Set();
    
    materials.forEach(m => {
        if (m.color) colors.add(m.color);
        if (m.size) sizes.add(m.size);
    });
    
    return {
        availableColors: Array.from(colors),
        availableSizes: Array.from(sizes)
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

    // ========================================
    // 1. Fetch dữ liệu sản phẩm theo slug
    // ========================================
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/slug/${slug}`);
                if (!res.ok) throw new Error("Không thể lấy dữ liệu sản phẩm");

                const data = await res.json(); // Data là OBJECT, không phải mảng

                // 💡 SỬA LỖI 1: Kiểm tra data là object hợp lệ
                if (data && data.product_id) { 
                    const productData = data; 
                    
                    // 💡 SỬA LỖI 2: Trích xuất availableColors/Sizes từ mảng materials
                    const { availableColors, availableSizes } = extractOptions(productData.materials);

                    setProduct({
                        ...productData, // Giữ lại tất cả dữ liệu gốc
                        availableColors, // Thêm mảng màu đã trích xuất
                        availableSizes // Thêm mảng size đã trích xuất
                    });

                    setDisplayImage(productData.image);

                    if (availableSizes.length > 0) {
                        setSelectedSize(availableSizes[0]);
                    }
                } else {
                    setProduct(null); // Không tìm thấy sản phẩm
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
    // 2. Xử lý khi click chọn màu (Toggle)
    // ========================================
    const handleColorSelect = (color) => {
        if (!product) return;

        // Nếu click lại đúng màu đang chọn => BỎ chọn và quay về ảnh gốc
        if (selectedColor === color) {
            setSelectedColor(null);
            setDisplayImage(product.image);
            return;
        }

        // Nếu click sang màu khác => đổi ảnh sang ảnh của màu mới
        setSelectedColor(color);

        // 💡 Sử dụng product.materials để tìm kiếm
        const found = product.materials?.find(
            (m) => m.color === color && m.image && m.image.trim() !== ""
        );

        if (found) {
            setDisplayImage(found.image);
        } else {
            // Nếu màu này không có ảnh -> quay về ảnh gốc
            setDisplayImage(product.image);
        }
    };

    // ========================================
    // 3. Thêm vào giỏ hàng
    // ========================================
    const handleAddToCart = () => {
        // ... (Giữ nguyên logic giỏ hàng) ...
        if (!product) return;

        // Bắt buộc phải chọn màu nếu sản phẩm có nhiều màu
        if (product.availableColors?.length > 0 && !selectedColor) {
            alert("Vui lòng chọn màu sắc trước khi thêm vào giỏ hàng!");
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const variantKey = `${product.product_id}-${selectedColor || "NoColor"}-${selectedSize || "NoSize"}`;
        const existingIndex = cart.findIndex(item => item.variantKey === variantKey);

        const cartItem = {
            productId: product.product_id,
            name: product.name,
            price: Number(product.price),
            quantity,
            image: displayImage,
            color: selectedColor,
            size: selectedSize,
            variantKey: variantKey
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
    // 4. JSX hiển thị
    // ========================================
    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (!product) return <p>Không tìm thấy sản phẩm</p>;

    return (
        <div className="container">
            <h2>Chi Tiết Sản Phẩm: {product.name}</h2>
            <div className="product-align">
                {/* Ảnh sản phẩm */}
                <img
                    src={`http://localhost:5000/images/${displayImage}`}
                    alt={product.name}
                    style={{ width: "700px" }}
                />

                <div className="product-info">
                    <h2>{product.name}</h2>
                    <p>Giá: {Number(product.price).toLocaleString("vi-VN")} VNĐ</p>
                    <p>{product.description}</p>

                    {/* Chọn màu */}
                    {product.availableColors?.length > 0 && (
                        <div className="product-options">
                            <label>Màu sắc:</label>
                            <div className="option-chips">
                                {product.availableColors.map(color => (
                                    <span
                                        key={color}
                                        className={`color-chip ${selectedColor === color ? "active" : ""}`}
                                        style={{
                                            backgroundColor: color.toLowerCase(),
                                            border: selectedColor === color ? "2px solid #000" : "1px solid #ccc"
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
                                {product.availableSizes.map(size => (
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