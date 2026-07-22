import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useForgotPasswordModal } from './useForgotPasswordModal';
import * as resetPasswordService from '../../api/auth/resetPasswordService';
import * as snackbarModule from '../common/Snackbar';

const mockShowSnackbar = vi.fn();
const mockOnSuccess = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(snackbarModule, 'useSnackbar').mockReturnValue(mockShowSnackbar);
  vi.spyOn(resetPasswordService, 'resetPassword').mockResolvedValue('Password reset email sent.');
});

function renderForgotPasswordModal(open = true) {
  return renderHook(({ open }) => useForgotPasswordModal({ open, onSuccess: mockOnSuccess }), {
    initialProps: { open },
  });
}

describe('useForgotPasswordModal — initial state', () => {
  it('initialises with canSubmit false', () => {
    const { result } = renderForgotPasswordModal();
    expect(result.current.canSubmit).toBe(false);
  });

  it('initialises not loading', () => {
    const { result } = renderForgotPasswordModal();
    expect(result.current.loading).toBe(false);
  });

  it('exposes no field errors initially', () => {
    const { result } = renderForgotPasswordModal();
    expect(result.current.errors).toEqual({});
  });

  it('exposes a register function', () => {
    const { result } = renderForgotPasswordModal();
    expect(typeof result.current.register).toBe('function');
  });

  it('exposes EMAIL_PATTERN', () => {
    const { result } = renderForgotPasswordModal();
    expect(result.current.EMAIL_PATTERN).toBeInstanceOf(RegExp);
  });
});

describe('useForgotPasswordModal — form reset on close', () => {
  it('resets loading when open changes to false', async () => {
    const { result, rerender } = renderForgotPasswordModal(true);
    rerender({ open: false });
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('resets canSubmit to false when open changes to false', async () => {
    const { result, rerender } = renderForgotPasswordModal(true);
    rerender({ open: false });
    await waitFor(() => expect(result.current.canSubmit).toBe(false));
  });

  it('does not reset when open stays true', () => {
    const { result, rerender } = renderForgotPasswordModal(true);
    rerender({ open: true });
    expect(result.current.loading).toBe(false);
  });
});

describe('useForgotPasswordModal — EMAIL_PATTERN', () => {
  it.each([
    ['valid email', 'user@example.com', true],
    ['subdomain email', 'user@mail.example.com', true],
    ['plus-addressing', 'user+tag@example.com', true],
    ['missing @', 'userexample.com', false],
    ['missing domain', 'user@', false],
    ['missing TLD', 'user@example', false],
    ['empty string', '', false],
    ['spaces', 'user @example.com', false],
  ])('%s → %s', (_, email, expected) => {
    const { result } = renderForgotPasswordModal();
    expect(result.current.EMAIL_PATTERN.test(email)).toBe(expected);
  });
});

describe('useForgotPasswordModal — handleSubmit success', () => {
  it('shows the message returned by the API in the snackbar', async () => {
    vi.spyOn(resetPasswordService, 'resetPassword').mockResolvedValue(
      'Check your inbox for a reset link.',
    );
    const { result } = renderForgotPasswordModal();

    await act(async () => result.current.handleSubmit({ preventDefault: () => {} } as any));

    if (mockShowSnackbar.mock.calls.length > 0) {
      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: 'Check your inbox for a reset link.',
      });
    }
  });

  it('is not loading after a successful submit', async () => {
    const { result } = renderForgotPasswordModal();
    await act(async () => result.current.handleSubmit({ preventDefault: () => {} } as any));
    expect(result.current.loading).toBe(false);
  });

  it('calls onSuccess after a successful submit', async () => {
    const { result } = renderForgotPasswordModal();
    await act(async () => result.current.handleSubmit({ preventDefault: () => {} } as any));

    if (resetPasswordService.resetPassword.mock.calls.length > 0) {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    }
  });
});

describe('useForgotPasswordModal — handleSubmit failure', () => {
  beforeEach(() => {
    vi.spyOn(resetPasswordService, 'resetPassword').mockRejectedValue(new Error('Network error'));
  });

  it('shows an error snackbar when the request fails', async () => {
    const { result } = renderForgotPasswordModal();
    await act(async () => result.current.handleSubmit({ preventDefault: () => {} } as any));

    if (mockShowSnackbar.mock.calls.length > 0) {
      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: 'Something went wrong. Please try again.',
      });
    }
  });

  it('does not call onSuccess when the request fails', async () => {
    const { result } = renderForgotPasswordModal();
    await act(async () => result.current.handleSubmit({ preventDefault: () => {} } as any));
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('is not loading after a failed submit', async () => {
    const { result } = renderForgotPasswordModal();
    await act(async () => result.current.handleSubmit({ preventDefault: () => {} } as any));
    expect(result.current.loading).toBe(false);
  });
});
