import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser } from './registerService';
import httpClient from '../axios';

vi.mock('../axios');

const mockedPost = vi.mocked(httpClient.post);

const VALID_PAYLOAD = {
  email: 'user@example.com',
  password: 'Password1!',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockedPost.mockResolvedValue({ data: { message: 'Registration successful.' } });
});

describe('registerUser — request', () => {
  it('calls the correct endpoint', async () => {
    await registerUser(VALID_PAYLOAD);
    expect(mockedPost).toHaveBeenCalledWith('/auth/register', VALID_PAYLOAD);
  });

  it('passes email and password in the payload', async () => {
    await registerUser(VALID_PAYLOAD);
    expect(mockedPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        email: 'user@example.com',
        password: 'Password1!',
      }),
    );
  });
});

describe('registerUser — response', () => {
  it('returns the message string from the response', async () => {
    const result = await registerUser(VALID_PAYLOAD);
    expect(result).toBe('Registration successful.');
  });

  it('returns whatever message the server sends', async () => {
    mockedPost.mockResolvedValue({ data: { message: 'Please check your email to confirm.' } });
    const result = await registerUser(VALID_PAYLOAD);
    expect(result).toBe('Please check your email to confirm.');
  });
});

describe('registerUser — error handling', () => {
  it('throws when the request fails', async () => {
    mockedPost.mockRejectedValue(new Error('Conflict'));
    await expect(registerUser(VALID_PAYLOAD)).rejects.toThrow('Conflict');
  });

  it('calls the endpoint exactly once even on failure', async () => {
    mockedPost.mockRejectedValue(new Error('Conflict'));
    await registerUser(VALID_PAYLOAD).catch(() => {});
    expect(mockedPost).toHaveBeenCalledTimes(1);
  });
});
