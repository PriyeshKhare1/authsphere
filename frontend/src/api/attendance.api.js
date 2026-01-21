import api from "./axios";

const BASE_URL = "/attendance";

// ✅ Check In
export const checkIn = async () => {
  try {
    const { data } = await api.post(`${BASE_URL}/checkin`, {});
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Check-in failed");
  }
};

// ✅ Check Out
export const checkOut = async () => {
  try {
    const { data } = await api.post(`${BASE_URL}/checkout`, {});
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Check-out failed");
  }
};

// ✅ Get Today's Attendance
export const getTodayAttendance = async () => {
  try {
    const { data } = await api.get(`${BASE_URL}/today`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch attendance");
  }
};

// ✅ Get Team Attendance (for managers)
export const getTeamAttendance = async () => {
  try {
    const { data } = await api.get(`${BASE_URL}/team`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch team attendance");
  }
};

// ✅ Get my attendance history
export const getMyAttendanceHistory = async () => {
  try {
    const { data } = await api.get(`${BASE_URL}/history`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch history");
  }
};

// ✅ Manager updates attendance status
export const updateAttendanceStatus = async (attendanceId, status) => {
  try {
    const { data } = await api.put(`${BASE_URL}/update-status`, { attendanceId, status });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update attendance");
  }
};

// ✅ Reset Today's Attendance
export const resetTodayAttendance = async () => {
  try {
    const { data } = await api.post(`${BASE_URL}/reset-today`, {});
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to reset attendance");
  }
};


// ✅ Get managerworking  history
export const ManagerWorkingHistory = async () => {
  try {
    const { data } = await api.get(`${BASE_URL}/Man-history`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch history");
  }
};

