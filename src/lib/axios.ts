import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error.response?.data ?? error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;