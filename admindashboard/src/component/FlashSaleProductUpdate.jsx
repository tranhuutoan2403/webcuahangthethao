import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/productupdate.css";

export default function FlashSaleProductUpdate() {
  const { id } = useParams(); // Lấy ID flash_sale_product từ URL
  const navigate = useNavigate();

  const [flashSaleId, setFlashSaleId] = useState("");
  const [productId, setProductId] = useState("");
  const [stockLimit, setStockLimit] = useState("");

  const [flashSales, setFlashSales] = useState([]);
  const [products, setProducts] = useState([]);

  // 1. Lấy dữ liệu flash sale product ban đầu
  useEffect(() => {
    fetch(`http://localhost:5000/api/flash-sale-products/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải dữ liệu flash sale product");
        return res.json();
      })
      .then((data) => {
        setFlashSaleId(data.flash_sale_id || "");
        setProductId(data.product_id || "");
        setStockLimit(data.stock_limit || "");
      })
      .catch((err) => {
        console.error(err);
        alert("Không thể tải dữ liệu sản phẩm trong flash sale.");
        navigate("/flashsale-products");
      });
  }, [id, navigate]);

  // 2. Lấy danh sách Flash Sale
  useEffect(() => {
    fetch("http://localhost:5000/api/flash-sale", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFlashSales(data))
      .catch((err) => console.error("Lỗi khi tải Flash Sales:", err));
  }, []);

  // 3. Lấy danh sách Products
  useEffect(() => {
    fetch("http://localhost:5000/api/products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi khi tải Products:", err));
  }, []);

  // 4. Xử lý cập nhật flash sale product
  const handleUpdate = () => {
    fetch(`http://localhost:5000/api/flash-sale-products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify({
        flash_sale_id: flashSaleId,
        product_id: productId,
        stock_limit: stockLimit,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Cập nhật thất bại!");
        return res.json();
      })
      .then(() => {
        navigate("/flash-sale-products"); // Quay lại danh sách flash sale
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="update-form-container">
      <h2>Cập nhật Sản Phẩm Trong Flash Sale</h2>

      {/* Select Flash Sale */}
      <div>
        <label>Flash Sale:</label>
        <select
          name="flash_sale_id"
          value={flashSaleId}
          onChange={(e) => setFlashSaleId(e.target.value)}
          required
        >
          <option value="">-- Chọn Flash Sale --</option>
          {flashSales.map((fs) => (
            <option key={fs.flash_sale_id} value={fs.flash_sale_id}>
              {fs.name} (ID: {fs.flash_sale_id})
            </option>
          ))}
        </select>
      </div>

      {/* Select Product */}
      <div>
        <label>Sản Phẩm:</label>
        <select
          name="product_id"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        >
          <option value="">-- Chọn Sản Phẩm --</option>
          {products.map((p) => (
            <option key={p.product_id} value={p.product_id}>
              {p.name} (ID: {p.product_id})
            </option>
          ))}
        </select>
      </div>

      {/* Stock Limit */}
      <div>
        <label>Giới hạn số lượng (Stock Limit):</label>
        <input
          type="number"
          name="stock_limit"
          value={stockLimit}
          onChange={(e) => setStockLimit(e.target.value)}
          placeholder="Nhập giới hạn số lượng"
        />
      </div>

      <button onClick={handleUpdate}>Lưu</button>
    </div>
  );
}
