// import api from "./axios";

// // 🔐 Login
// export const loginUser = async (data) => {
//   try {
//     const res = await api.post("/api/auth/login", data);

//     // store token and user in localStorage
//     if (res.data?.token && res.data?.user) {
//       localStorage.setItem(
//         "auth_user",
//         JSON.stringify({
//           token: res.data.token,
//           user: res.data.user,
//         })
//       );
//     }

//     return res.data;
//   } catch (err) {
//     throw err.response?.data || { message: "Login failed" };
//   }
// };

// // 🔐 Register
// export const registerUser = async (data) => {
//   try {
//     const res = await api.post("/api/auth/register", data);

//     // store token and user in localStorage
//     if (res.data?.token && res.data?.user) {
//       localStorage.setItem(
//         "auth_user",
//         JSON.stringify({
//           token: res.data.token,
//           user: res.data.user,
//         })
//       );
//     }

//     return res.data;
//   } catch (err) {
//     throw err.response?.data || { message: "Signup failed" };
//   }
// };


// import api from "./axios";

// // Register
// export const registerUser = async (data) => {
//   const res = await api.post("/api/auth/register", data);
//   return res.data;
// };

// // Login
// export const loginUser = async ({ email, password }) => {
//   const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
//   return data; // should be { user: {...}, token: "..." }
// };

// // Logout
// export const logoutUser = async () => {
//   const res = await api.post("/api/auth/logout");
//   return res.data;
// };


// // src/api/auth.api.js
// import api from "./axios"; // your preconfigured axios instance

// // ======================
// // Register a new user
// // ======================
// export const registerUser = async (data) => {
//   try {
//     const res = await api.post("/api/auth/register", data);
//     return res.data; // expected: { user: {...}, token: "..." }
//   } catch (err) {
//     throw new Error(err.response?.data?.message || "Registration failed");
//   }
// };

// // ======================
// // Login
// // ======================
// export const loginUser = async ({ email, password }) => {
//   try {
//     const { data } = await api.post("/api/auth/login", { email, password });
//     return data; // expected: { user: {...}, token: "..." }
//   } catch (err) {
//     throw new Error(err.response?.data?.message || "Login failed");
//   }
// };

// // ======================
// // Logout
// // ======================
// export const logoutUser = async () => {
//   try {
//     const { data } = await api.post("/api/auth/logout");
//     return data; // expected: { message: "Logged out successfully" }
//   } catch (err) {
//     throw new Error(err.response?.data?.message || "Logout failed");
//   }
// };





import api from "./axios";

const BASE_URL = "/auth";

export const loginUser = async ({ email, password }) => {
  try {
    const { data } = await api.post(`${BASE_URL}/login`, { email, password });
    return data; // { token, user: {...} }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || "Login failed";
    throw new Error(errorMsg);
  }
};

export const registerUser = async ({ name, email, password, role = "user" }) => {
  try {
    const { data } = await api.post(`${BASE_URL}/register`, { name, email, password, role });
    return data; // { token, user: {...} }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || "Registration failed";
    throw new Error(errorMsg);
  }
};