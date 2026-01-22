
// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config) => {
//   const stored = localStorage.getItem("auth_user");
//   if (stored) {
//     const parsed = JSON.parse(stored);
//     if (parsed?.token) {
//       config.headers.Authorization = `Bearer ${parsed.token}`;
//     }
//   }
//   return config;
// });

// let logoutInProgress = false;

// api.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     if (
//       error.response?.status === 401 &&
//       !logoutInProgress
//     ) {
//       logoutInProgress = true;

//       // DO NOT redirect here
//       localStorage.clear();

//       // Dispatch a custom event instead
//       window.dispatchEvent(new Event("auth-logout"));
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;



import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // <-- SIMPLE & SAFE
  timeout: 60000, // 60 sec (Railway fast hai, phir bhi safe)
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if exists
api.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        const { token } = JSON.parse(stored);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      // ignore parse errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage =
        currentPath.includes("/signin") ||
        currentPath.includes("/signup") ||
        currentPath.includes("/auth");

      localStorage.clear();

      if (!isAuthPage) {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
