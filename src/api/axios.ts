import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { getToken } from './auth/authService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
