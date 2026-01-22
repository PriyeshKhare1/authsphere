

import api from "./axios";

const BASE_URL = "/api/auth";

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