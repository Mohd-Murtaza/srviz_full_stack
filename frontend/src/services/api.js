import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject({ message, status: error.response?.status });
  }
);

// API methods
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
};

export const leadsAPI = {
    create: (data) => api.post('/leads', data),
    getAll: (params) => api.get('/leads', { params }),
    getById: (id) => api.get(`/leads/${id}`),
    updateStatus: (id, data) => api.patch(`/leads/${id}`, data),
};

export const quotesAPI = {
    generate: (data) => api.post('/quotes/generate', data),
};

export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
