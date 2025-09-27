import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Interceptor tự động gắn token vào headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor bắt lỗi khi token hết hạn
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");

      // Xóa token và thông tin user trong localStorage
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");

      // Chuyển hướng về trang đăng nhập
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
