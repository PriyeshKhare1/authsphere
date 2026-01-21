import api from './axios';

// Get all active users
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

// Get all removed (soft deleted) users
export const getRemovedUsers = async () => {
  const response = await api.get('/admin/users/removed');
  return response.data;
};

// Soft delete a user (Fire user)
export const deleteUser = async (userId, reason) => {
  const response = await api.delete(`/admin/users/${userId}`, { data: { reason } });
  return response.data;
};

// Restore a soft deleted user
export const restoreUser = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/restore`);
  return response.data;
};

// Permanently delete a user
export const permanentlyDeleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}/permanent`);
  return response.data;
};

// Update user role
export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};
