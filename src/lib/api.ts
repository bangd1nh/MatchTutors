import axios from "axios";

const apiClient = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL,
   headers: {
      "Content-Type": "application/json",
   },
});

apiClient.interceptors.request.use(
   (config) => {
      // Lấy token trực tiếp từ localStorage thay vì từ store
      const token = localStorage.getItem("token");
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config;

      // Xử lý khi token hết hạn (lỗi 401)
      if (error.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true;

         // Xóa token khỏi localStorage và chuyển hướng người dùng về trang đăng nhập
         localStorage.removeItem("token");
         window.location.href = "/login";

         // Trả về một Promise bị reject để ngăn request ban đầu tiếp tục
         return Promise.reject(error);
      }

      return Promise.reject(error);
   }
);

export default apiClient;
