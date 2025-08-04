import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all users (Admin only)
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response;
};

// Get user by ID
export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response;
};

// Update user (Admin only)
export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response;
};

// Delete user (Admin only)
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response;
};

// Update user role (Admin only)
export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/users/${userId}/role`, { role });
  return response;
};

// Get user profile
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response;
};

// Update user profile
export const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response;
};

// Change password
export const changePassword = async (passwordData) => {
  const response = await api.put('/users/change-password', passwordData);
  return response;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response;
};

// Reset password
export const resetPassword = async (token, password) => {
  const response = await api.put('/auth/reset-password', { token, password });
  return response;
};

const userService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  getUserProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};

export default userService; 