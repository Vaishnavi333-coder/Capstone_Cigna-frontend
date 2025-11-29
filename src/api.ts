import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

const instance = axios.create({ baseURL: API_BASE });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
