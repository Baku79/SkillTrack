import axios from 'axios';

// In production (Vercel), use VITE_API_URL env variable (e.g. https://skilltrack-api.onrender.com)
// In development, Vite proxy handles /api → localhost:5000 if VITE_API_URL is empty
const BASE = import.meta.env.VITE_API_URL || '';

if (BASE) {
  // Set default baseURL for all direct axios calls across the app
  axios.defaults.baseURL = BASE;
}

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
