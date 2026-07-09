import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { getToken } from './auth/authService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {},
});

api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const t = getToken();
  if (t) {
    if (!cfg.headers) cfg.headers = {} as any;
    (cfg.headers as Record<string, string>)['Authorization'] = `Bearer ${t}`;
  }

  return cfg;
});

export default api;
