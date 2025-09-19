import React, { useEffect, useState } from "react";
import "../CSS/user.css"
function Product() {
  const [Product, setProduct] = useState([]);

  // Hàm để lấy danh sách user từ API
  const fetchProduct = () => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  };

  // Lấy danh sách users ban đầu khi component được render
  useEffect(() => {
    fetchProduct();
  }, []);

  // Hàm xóa user
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            alert("Xóa thành công!");
            // Gọi lại hàm fetchProducts để cập nhật danh sách
            fetchProduct(); 
          } else {
            console.error("Lỗi khi xóa:", res.statusText);
            alert("Có lỗi xảy ra khi xóa sản phẩm.");
          }
        })
        .catch((err) => {
          console.error("Lỗi khi xóa:", err);
          alert("Có lỗi khi kết nối đến máy chủ.");
        });
    }
  };

  return (
    <div className="user-list">
       <button
          className="edit-btn"
          onClick={() => (window.location.href = `/product/add`)}
        >
          Thêm
        </button>
      <h2>Danh sách Sản Phẩm</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Hình Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          
          {Product.length > 0 ? (
            Product.map((product) => (
              <tr >
                <td>{product.product_id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
                    <img src={`http://localhost:5000/images/${product.image}`} alt={product.name} className="product-image" />
                </td>
                <td>
                  
                  <button
                    className="edit-btn"
                    onClick={() => (window.location.href = `/product/update/${product.product_id}`)}
                  >
                    Sửa
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product.product_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Không có sản phẩm nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Product;
