import axios, { AxiosInstance } from 'axios';

// Bạn có thể thay baseURL tùy vào môi trường:
const apiclient: AxiosInstance = axios.create({
  baseURL: 'https://localhost:7265/api/', // hoặc dùng biến môi trường
  headers: {
    'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
    Accept: '*/*',
  },
});

// Chỉ gắn interceptor khi chạy ở phía client (tránh lỗi SSR)
if (typeof window !== 'undefined') {
  apiclient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

export default apiclient;
