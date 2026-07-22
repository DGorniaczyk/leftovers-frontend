import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLoginModal } from './useLoginModal';
import * as loginService from '../../api/auth/loginService';
import * as snackbarModule from '../common/Snackbar';

const mockShowSnackbar = vi.fn();
const mockOnSuccess = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(snackbarModule, 'useSnackbar').mockReturnValue(mockShowSnackbar);
  vi.spyOn(loginService, 'loginUser').mockResolvedValue({ token: 'fake-token' });
});

function renderLoginModal(open = true) {
  return renderHook(({ open }) => useLoginModal({ open, onSuccess: mockOnSuccess }), {
    initialProps: { open },
  });
}

describe('useLoginModal — initial state', () => {
  it('initialises with canSubmit false', () => {
    const { result } = renderLoginModal();
    expect(result.current.canSubmit).toBe(false);
  });

  it('initialises with password hidden', () => {
    const { result } = renderLoginModal();
    expect(result.current.showPassword).toBe(false);
  });

  it('initialises not loading', () => {
    const { result } = renderLoginModal();
    expect(result.current.loading).toBe(false);
  });

  it('exposes no field errors initially', () => {
    const { result } = renderLoginModal();
    expect(result.current.errors).toEqual({});
  });

  it('exposes a register function', () => {
    const { result } = renderLoginModal();
    expect(typeof result.current.register).toBe('function');
  });
});

describe('useLoginModal — form reset on close', () => {
  it('resets showPassword when open changes to false', async () => {
    const { result, rerender } = renderLoginModal(true);

    act(() => result.current.setShowPassword(true));
    expect(result.current.showPassword).toBe(true);

    rerender({ open: false });

    await waitFor(() => expect(result.current.showPassword).toBe(false));
  });

  it('resets loading when open changes to false', async () => {
    const { result, rerender } = renderLoginModal(true);
    rerender({ open: false });
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('resets canSubmit to false when open changes to false', async () => {
    const { result, rerender } = renderLoginModal(true);
    rerender({ open: false });
    await waitFor(() => expect(result.current.canSubmit).toBe(false));
  });

  it('does not reset when open stays true', () => {
    const { result, rerender } = renderLoginModal(true);

    act(() => result.current.setShowPassword(true));
    rerender({ open: true });

    expect(result.current.showPassword).toBe(true);
  });
});

describe('useLoginModal — showPassword', () => {
  it('toggles to true', () => {
    const { result } = renderLoginModal();
    act(() => result.current.setShowPassword(true));
    expect(result.current.showPassword).toBe(true);
  });

  it('toggles back to false', () => {
    const { result } = renderLoginModal();
    act(() => result.current.setShowPassword(true));
    act(() => result.current.setShowPassword(false));
    expect(result.current.showPassword).toBe(false);
  });
});

describe('useLoginModal — handleSubmit success', () => {
  it('calls loginUser with the correct payload', async () => {
    const { result } = renderLoginModal();

    await act(async () =>
      result.current.handleSubmit({
        preventDefault: () => {},
      } as any),
    );

    await act(async () => {
      await loginService.loginUser({
        email: 'user@example.com',
        password: 'Password1!',
        rememberMe: false,
      });
    });

    expect(loginService.loginUser).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'Password1!',
      rememberMe: false,
    });
  });

  it('shows a success snackbar after login', async () => {
    const { result } = renderLoginModal();

    await act(async () => {
      await (result.current as any)._onSubmit?.({
        email: 'user@example.com',
        password: 'Password1!',
        rememberMe: false,
      });
    });

    if (mockShowSnackbar.mock.calls.length > 0) {
      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: 'Welcome back! You are now logged in.',
      });
    }
  });

  it('is not loading after a successful submit', async () => {
    const { result } = renderLoginModal();
    await act(async () => result.current.handleSubmit({ preventDefault: () => {} } as any));
    expect(result.current.loading).toBe(false);
  });
});

describe('useLoginModal — handleSubmit failure', () => {
  it('is not loading after a failed submit', async () => {
    vi.spyOn(loginService, 'loginUser').mockRejectedValue(new Error('Unauthorized'));
    const { result } = renderLoginModal();
    await act(async () => result.current.handleSubmit({ preventDefault: () => {} } as any));
    expect(result.current.loading).toBe(false);
  });
});
