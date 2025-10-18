import React, { useEffect, useState } from "react";
import "../CSS/user.css";

function Voucher() {
  const [vouchers, setVouchers] = useState([]);
  const [categories, setCategories] = useState({}); // lưu dạng {id: name}

  // Lấy danh sách voucher
  const fetchVouchers = () => {
    fetch("http://localhost:5000/api/vouchers")
      .then((res) => res.json())
      .then((data) => setVouchers(data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  };

  // Lấy danh sách category
  const fetchCategories = () => {
    fetch("http://localhost:5000/api/categogy'")
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        data.forEach((c) => {
          map[c.category_id] = c.name;
        });
        setCategories(map);
      })
      .catch((err) => console.error("Lỗi khi lấy category:", err));
  };

  useEffect(() => {
    fetchVouchers();
    fetchCategories();
  }, []);

  // Xóa voucher
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa voucher này?")) {
      fetch(`http://localhost:5000/api/vouchers/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            alert("Xóa voucher thành công!");
            fetchVouchers(); // cập nhật danh sách
          } else {
            console.error("Lỗi khi xóa:", res.statusText);
            alert("Có lỗi xảy ra khi xóa voucher.");
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
        onClick={() => (window.location.href = `/voucher/add/`)}
      >
        Thêm Voucher
      </button>
      <h2>Danh sách Voucher</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Danh mục</th> {/* thêm cột hiển thị tên category */}
            <th>Loại</th>
            <th>Giá trị</th>
            <th>Đơn tối thiểu</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.length > 0 ? (
            vouchers.map((v) => (
              <tr key={v.voucher_id}>
                <td>{v.voucher_id}</td>
                <td>{v.code}</td>
                <td>{v.category_name}</td> {/* hiển thị tên category */}
                <td>{v.discount_type}</td>
                <td>{v.discount_value.toLocaleString()}</td>
                <td>{v.min_order_amount.toLocaleString()}</td>
                <td>{v.status}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      (window.location.href = `/voucher/update/${v.voucher_id}`)
                    }
                  >
                    Sửa
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(v.voucher_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Không có voucher nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Voucher;
