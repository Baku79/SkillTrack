import axios from 'axios';

// In production (Vercel), use VITE_API_URL env variable
// In development, Vite proxy handles /api → localhost:5000
const BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
