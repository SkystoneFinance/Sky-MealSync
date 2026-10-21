import axios from "axios";

import {
  SESSION_EXPIRED_EVENT,
  TOKEN_KEY,
} from "./session";

// Endpoints where a 401 means "wrong credentials", not "session expired".
const CREDENTIAL_ENDPOINTS = [
  "/auth/login",
  "/staff-auth/login",
  "/staff-auth/activate",
];

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error.response?.data ?? error.message);

    // Token expired, revoked or signed with an old secret → end the session
    if (
      error.response?.status === 401 &&
      error.config?.headers?.Authorization &&
      !CREDENTIAL_ENDPOINTS.includes(error.config.url)
    ) {
      window.dispatchEvent(
        new Event(SESSION_EXPIRED_EVENT)
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
