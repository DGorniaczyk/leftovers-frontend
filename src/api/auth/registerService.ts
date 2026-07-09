import httpClient from '../axios';

export interface RegisterRequest {
  email: string;
  password: string;
}

export async function registerUser(data: RegisterRequest): Promise<string> {
  const response = await httpClient.post<{ message: string }>('/auth/register', data);
  return response.data.message;
}
