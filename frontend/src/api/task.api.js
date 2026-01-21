import api from "./axios";

const API_URL = `/tasks`;

// Get all tasks for current user (own + assigned)
export const getTasks = async () => {
  try {
    const res = await api.get(API_URL);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tasks");
  }
};

// Get specific task by ID
export const getTaskById = async (taskId) => {
  try {
    const res = await api.get(`${API_URL}/${taskId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch task");
  }
};

// Create new task (user creates own OR manager assigns to team)
export const createTask = async (taskData) => {
  try {
    const res = await api.post(API_URL, taskData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create task");
  }
};

// Delete task (only creator can delete)
export const deleteTask = async (taskId) => {
  try {
    const res = await api.delete(`${API_URL}/${taskId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete task");
  }
};

// Submit reply to task
export const submitTaskReply = async (taskId, replyData) => {
  try {
    const res = await api.post(`${API_URL}/${taskId}/reply`, replyData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to submit reply");
  }
};

// Mark task as done/complete
export const completeTask = async (taskId) => {
  try {
    const res = await api.put(`${API_URL}/${taskId}/complete`, {});
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to complete task");
  }
};

// Update task status (assigned user)
export const updateTaskStatus = async (taskId, payload) => {
  try {
    const res = await api.put(`${API_URL}/${taskId}/status`, payload);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update task status");
  }
};

// Manager assigns task to team member
export const assignTaskToUser = async (taskData) => {
  try {
    const res = await api.post(`${API_URL}/assign`, taskData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to assign task");
  }
};

// Get all tasks created/assigned by manager
export const getManagerTasks = async () => {
  try {
    const res = await api.get(`${API_URL}/manager/all`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch manager tasks");
  }
};

// Backward-compatible aliases
export const updateTaskReply = submitTaskReply;
export const markTaskDone = completeTask;
