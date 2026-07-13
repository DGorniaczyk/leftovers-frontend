import httpClient from '../axios';
import { setToken } from './authService';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  token: string;
}

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await httpClient.post<LoginResponse>('/auth/login', payload);
  setToken(data.token);
  return data;
}
