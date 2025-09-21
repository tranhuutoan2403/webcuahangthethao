import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Đúng URL backend
});

// Interceptor tự động gắn token vào headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token"); // Token đã lưu khi login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
