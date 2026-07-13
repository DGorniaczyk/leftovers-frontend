import httpclient from '../axios';

export interface ResetPasswordRequest {
  email: string;
}

export interface NewPasswordRequest {
  token: string;
  password: string;
}

export async function resetPassword(data: ResetPasswordRequest): Promise<string> {
  const response = await httpclient.post<{ message: string }>('/auth/reset-password', data);
  return response.data.message;
}

export async function setNewPassword(data: NewPasswordRequest): Promise<string> {
  const response = await httpclient.post<{ message: string }>('/auth/confirm-reset-password', data);
  return response.data.message;
}
