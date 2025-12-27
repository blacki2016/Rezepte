import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const recipeAPI = {
  getAll: (params) => api.get('/recipes', { params }),
  getById: (id) => api.get(`/recipes/${id}`),
  create: (data) => api.post('/recipes', data),
  update: (id, data) => api.put(`/recipes/${id}`, data),
  delete: (id) => api.delete(`/recipes/${id}`),
};

export const videoAPI = {
  processUrl: (url, platform) => api.post('/videos/process', { url, platform }),
  upload: (formData) => api.post('/videos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const plannerAPI = {
  getAll: (params) => api.get('/planner', { params }),
  getById: (id) => api.get(`/planner/${id}`),
  create: (data) => api.post('/planner', data),
  update: (id, data) => api.put(`/planner/${id}`, data),
  delete: (id) => api.delete(`/planner/${id}`),
  getShoppingList: (planIds) => api.post('/planner/shopping-list', { planIds }),
};

export default api;
