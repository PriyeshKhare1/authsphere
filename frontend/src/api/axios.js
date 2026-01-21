

import axios from "axios";

const resolveBaseURL = () => {
  const raw =
    (typeof process !== "undefined"
      ? process.env?.VITE_API_URL || process.env?.REACT_APP_API_URL
      : undefined) || "http://localhost:5000";

  return raw.endsWith("/api") ? raw : `${raw}/api`;
};

const api = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    // ignore
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on signin/auth pages
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath.includes('/signin') || currentPath.includes('/auth') || currentPath.includes('/signup');
      
      localStorage.clear();
      
      if (!isAuthPage) {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
