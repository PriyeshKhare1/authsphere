import api from "./axios";

// ✅ Get all active users
export const getAllUsers = async () => {
  const { data } = await api.get("/api/admin/users");
  return data;
};

// ✅ Get all removed (soft deleted) users
export const getRemovedUsers = async () => {
  const { data } = await api.get("/api/admin/users/removed");
  return data;
};

// ✅ Soft delete a user
export const deleteUser = async (userId, reason) => {
  const { data } = await api.delete(`/api/admin/users/${userId}`, {
    data: { reason },
  });
  return data;
};

// ✅ Restore user
export const restoreUser = async (userId) => {
  const { data } = await api.put(`/api/admin/users/${userId}/restore`);
  return data;
};

// ✅ Permanently delete user
export const permanentlyDeleteUser = async (userId) => {
  const { data } = await api.delete(`/api/admin/users/${userId}/permanent`);
  return data;
};

// ✅ Update user role
export const updateUserRole = async (userId, role) => {
  const { data } = await api.put(`/api/admin/users/${userId}/role`, { role });
  return data;
};
