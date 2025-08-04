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
    const response = await api.get(`/comments/post/${postId}`, { params });
    return response;
  },

  // Get single comment
  getComment: async (id) => {
    const response = await api.get(`/comments/${id}`);
    return response;
  },

  // Create new comment
  createComment: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response;
  },

  // Update comment
  updateComment: async (id, commentData) => {
    const response = await api.put(`/comments/${id}`, commentData);
    return response;
  },

  // Delete comment
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response;
  },

  // Like comment
  likeComment: async (id) => {
    const response = await api.post(`/comments/${id}/like`);
    return response;
  },

  // Unlike comment
  unlikeComment: async (id) => {
    const response = await api.delete(`/comments/${id}/like`);
    return response;
  },

  // Moderate comment (approve/reject)
  moderateComment: async (id, status) => {
    const response = await api.put(`/comments/${id}/moderate`, { status });
    return response;
  },
};

export default commentService; 