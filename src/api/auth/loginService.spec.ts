import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginUser } from './loginService';
import httpClient from '../axios';
import * as authService from './authService';

vi.mock('../axios');
vi.spyOn(authService, 'setToken').mockImplementation(() => {});

const mockedPost = vi.mocked(httpClient.post);

const VALID_PAYLOAD = {
  email: 'user@example.com',
  password: 'Password1!',
  rememberMe: false,
};

const MOCK_RESPONSE = { token: 'fake-jwt-token' };

beforeEach(() => {
  vi.clearAllMocks();
  mockedPost.mockResolvedValue({ data: MOCK_RESPONSE });
});

describe('loginUser — request', () => {
  it('calls the correct endpoint', async () => {
    await loginUser(VALID_PAYLOAD);
    expect(mockedPost).toHaveBeenCalledWith('/auth/login', VALID_PAYLOAD);
  });

  it('passes email, password and rememberMe in the payload', async () => {
    await loginUser(VALID_PAYLOAD);
    expect(mockedPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        email: 'user@example.com',
        password: 'Password1!',
        rememberMe: false,
      }),
    );
  });

  it('passes rememberMe as true when provided', async () => {
    await loginUser({ ...VALID_PAYLOAD, rememberMe: true });
    expect(mockedPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ rememberMe: true }),
    );
  });
});

describe('loginUser — response', () => {
  it('returns the response data', async () => {
    const result = await loginUser(VALID_PAYLOAD);
    expect(result).toEqual(MOCK_RESPONSE);
  });

  it('calls setToken with the token from the response', async () => {
    await loginUser(VALID_PAYLOAD);
    expect(authService.setToken).toHaveBeenCalledWith('fake-jwt-token');
  });

  it('calls setToken exactly once', async () => {
    await loginUser(VALID_PAYLOAD);
    expect(authService.setToken).toHaveBeenCalledTimes(1);
  });
});

describe('loginUser — error handling', () => {
  it('throws when the request fails', async () => {
    mockedPost.mockRejectedValue(new Error('Unauthorized'));
    await expect(loginUser(VALID_PAYLOAD)).rejects.toThrow('Unauthorized');
  });

  it('does not call setToken when the request fails', async () => {
    mockedPost.mockRejectedValue(new Error('Unauthorized'));
    await loginUser(VALID_PAYLOAD).catch(() => {});
    expect(authService.setToken).not.toHaveBeenCalled();
  });
});
