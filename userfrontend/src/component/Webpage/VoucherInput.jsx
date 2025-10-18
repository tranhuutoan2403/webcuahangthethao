import { useState, useEffect } from "react";
import "../CSS/voucherinput.css";

const VoucherInput = ({ onVoucherApplied }) => {
  const [code, setCode] = useState("");
  const [voucherInfo, setVoucherInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const savedVoucher = localStorage.getItem("appliedVoucher");
    if (savedVoucher) {
      const parsed = JSON.parse(savedVoucher);
      setVoucherInfo(parsed);
      onVoucherApplied(parsed);
    }
  }, [onVoucherApplied]);

  const handleApply = async () => {
    if (!code) {
      setModalMessage("⚠️ Vui lòng nhập mã voucher!");
      setShowModal(true);
      return;
    }

    // Nếu nhập lại đúng mã đã áp dụng
    if (voucherInfo && voucherInfo.code === code) {
      setModalMessage(`✅ Voucher "${code}" đã được áp dụng rồi`);
      setShowModal(true);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/vouchers/code/${code}`);
      const data = await res.json();

      if (!res.ok) {
        setVoucherInfo(null);
        onVoucherApplied(null);
        localStorage.removeItem("appliedVoucher");
        setModalMessage(data.message || "❌ Mã không hợp lệ hoặc đã hết hạn");
        setShowModal(true);
        return;
      }

      setVoucherInfo(data);
      onVoucherApplied(data);
      localStorage.setItem("appliedVoucher", JSON.stringify(data));

      // ✅ Xóa nội dung input sau khi áp dụng thành công
      setCode("");

      setModalMessage(`✅ Áp dụng voucher "${data.code}" thành công!`);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setVoucherInfo(null);
      onVoucherApplied(null);
      setModalMessage("❌ Lỗi server, vui lòng thử lại sau");
      setShowModal(true);
    }
  };

  return (
    <div className="voucher-container">
      <input
        type="text"
        placeholder="Nhập mã giảm giá..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="voucher-input"
      />
      <button onClick={handleApply} className="voucher-btn">
        Áp dụng
      </button>

      {/* Modal thông báo */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherInput;
