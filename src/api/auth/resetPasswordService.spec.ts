import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resetPassword, setNewPassword } from './resetPasswordService';
import httpClient from '../axios';

vi.mock('../axios');

const mockedPost = vi.mocked(httpClient.post);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('resetPassword — request', () => {
  beforeEach(() => {
    mockedPost.mockResolvedValue({ data: { message: 'Password reset email sent.' } });
  });

  it('calls the correct endpoint', async () => {
    await resetPassword({ email: 'user@example.com' });
    expect(mockedPost).toHaveBeenCalledWith('/auth/reset-password', { email: 'user@example.com' });
  });

  it('passes the email in the payload', async () => {
    await resetPassword({ email: 'user@example.com' });
    expect(mockedPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ email: 'user@example.com' }),
    );
  });
});

describe('resetPassword — response', () => {
  it('returns the message string from the response', async () => {
    mockedPost.mockResolvedValue({ data: { message: 'Password reset email sent.' } });
    const result = await resetPassword({ email: 'user@example.com' });
    expect(result).toBe('Password reset email sent.');
  });

  it('returns whatever message the server sends', async () => {
    mockedPost.mockResolvedValue({ data: { message: 'If this email exists, a link was sent.' } });
    const result = await resetPassword({ email: 'user@example.com' });
    expect(result).toBe('If this email exists, a link was sent.');
  });
});

describe('resetPassword — error handling', () => {
  it('throws when the request fails', async () => {
    mockedPost.mockRejectedValue(new Error('Network error'));
    await expect(resetPassword({ email: 'user@example.com' })).rejects.toThrow('Network error');
  });

  it('calls the endpoint exactly once on failure', async () => {
    mockedPost.mockRejectedValue(new Error('Network error'));
    await resetPassword({ email: 'user@example.com' }).catch(() => {});
    expect(mockedPost).toHaveBeenCalledTimes(1);
  });
});

const VALID_NEW_PASSWORD_PAYLOAD = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  password: 'NewPassword1!',
};

describe('setNewPassword — request', () => {
  beforeEach(() => {
    mockedPost.mockResolvedValue({ data: { message: 'Password updated successfully.' } });
  });

  it('calls the correct endpoint', async () => {
    await setNewPassword(VALID_NEW_PASSWORD_PAYLOAD);
    expect(mockedPost).toHaveBeenCalledWith(
      '/auth/confirm-reset-password',
      VALID_NEW_PASSWORD_PAYLOAD,
    );
  });

  it('passes token and password in the payload', async () => {
    await setNewPassword(VALID_NEW_PASSWORD_PAYLOAD);
    expect(mockedPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        password: 'NewPassword1!',
      }),
    );
  });
});

describe('setNewPassword — response', () => {
  it('returns the message string from the response', async () => {
    mockedPost.mockResolvedValue({ data: { message: 'Password updated successfully.' } });
    const result = await setNewPassword(VALID_NEW_PASSWORD_PAYLOAD);
    expect(result).toBe('Password updated successfully.');
  });

  it('returns whatever message the server sends', async () => {
    mockedPost.mockResolvedValue({ data: { message: 'Your password has been reset.' } });
    const result = await setNewPassword(VALID_NEW_PASSWORD_PAYLOAD);
    expect(result).toBe('Your password has been reset.');
  });
});

describe('setNewPassword — error handling', () => {
  it('throws when the token is invalid or expired', async () => {
    mockedPost.mockRejectedValue(new Error('Token expired'));
    await expect(setNewPassword(VALID_NEW_PASSWORD_PAYLOAD)).rejects.toThrow('Token expired');
  });

  it('throws when the request fails', async () => {
    mockedPost.mockRejectedValue(new Error('Network error'));
    await expect(setNewPassword(VALID_NEW_PASSWORD_PAYLOAD)).rejects.toThrow('Network error');
  });

  it('calls the endpoint exactly once on failure', async () => {
    mockedPost.mockRejectedValue(new Error('Network error'));
    await setNewPassword(VALID_NEW_PASSWORD_PAYLOAD).catch(() => {});
    expect(mockedPost).toHaveBeenCalledTimes(1);
  });
});
