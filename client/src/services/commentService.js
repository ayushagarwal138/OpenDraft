import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const commentService = {
  // Get comments for a post
  getComments: async (postId, params = {}) => {
    const response = await api.get(`/posts/${postId}/comments`, { params });
    return response;
  },

  // Create comment
  createComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response;
  },

  // Update comment
  updateComment: async (commentId, commentData) => {
    const response = await api.put(`/comments/${commentId}`, commentData);
    return response;
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response;
  },

  // Like comment
  likeComment: async (commentId) => {
    const response = await api.post(`/comments/${commentId}/like`);
    return response;
  },

  // Unlike comment
  unlikeComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}/like`);
    return response;
  },

  // Get all comments (Admin only)
  getAllComments: async (params = {}) => {
    const response = await api.get('/comments/all', { params });
    return response;
  },

  // Moderate comment (Admin/Author only)
  moderateComment: async (commentId, moderationData) => {
    const response = await api.put(`/comments/${commentId}/moderate`, moderationData);
    return response;
  },

  // Get user's comments
  getMyComments: async (params = {}) => {
    const response = await api.get('/comments/me', { params });
    return response;
  },
};

export default commentService; 