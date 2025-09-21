import api from "../api";

const handleLogin = async (username, password) => {
  try {
    const res = await api.post("/auth/login", { username, password });

    // Lưu token vào localStorage
    localStorage.setItem("admin_token", res.data.token);
    localStorage.setItem("admin_users", JSON.stringify(res.data.user));
    alert("Đăng nhập thành công!");
    return res.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

export default handleLogin;
