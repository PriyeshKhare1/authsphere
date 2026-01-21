// import axios from "axios";

// const API_URL = "http://localhost:5000/users";

// // Get login history
// export const getLoginHistoryApi = async () => {
//   const res = await axios.get(`${API_URL}/history`); // matches backend
//   return res.data.loginHistory;
// };

// // Check-in
// export const checkInApi = async () => {
//   const res = await axios.post(`${API_URL}/checkin`);
//   return { checkIn: new Date().toISOString() }; // optional, frontend display
// };

// // Check-out
// export const checkOutApi = async () => {
//   const res = await axios.post(`${API_URL}/checkout`);
//   return { checkOut: new Date().toISOString() }; // optional, frontend display
// };


import api from "./axios";

// Get login history
export const getLoginHistoryApi = async () => {
  const res = await api.get("/user/history");
  return res.data.loginHistory || [];
};

// Check-in
export const checkInApi = async () => {
  const res = await api.post("/user/checkin");
  return res.data;
};

// Check-out
export const checkOutApi = async () => {
  const res = await api.post("/user/checkout");
  return res.data;
};

// Get manager's team members
export const getManagerTeam = async () => {
  const res = await api.get("/users/team");
  return res.data;
};
