import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRegisterModal } from './useRegisterModal';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../constants/validation';
import * as registerService from '../../api/auth/registerService';
import * as snackbarModule from '../common/Snackbar';

const mockShowSnackbar = vi.fn();
const mockOnSuccess = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(snackbarModule, 'useSnackbar').mockReturnValue(mockShowSnackbar);
  vi.spyOn(registerService, 'registerUser').mockResolvedValue('');
});

function renderRegisterModal(open = true) {
  return renderHook(({ open }) => useRegisterModal({ open, onSuccess: mockOnSuccess }), {
    initialProps: { open },
  });
}

describe('useRegisterModal — initial state', () => {
  it('initialises with canSubmit false', () => {
    const { result } = renderRegisterModal();
    expect(result.current.canSubmit).toBe(false);
  });

  it('initialises with password hidden', () => {
    const { result } = renderRegisterModal();
    expect(result.current.showPassword).toBe(false);
  });

  it('initialises not loading', () => {
    const { result } = renderRegisterModal();
    expect(result.current.loading).toBe(false);
  });

  it('exposes a register function for RHF field wiring', () => {
    const { result } = renderRegisterModal();
    expect(typeof result.current.register).toBe('function');
  });

  it('exposes no field errors initially', () => {
    const { result } = renderRegisterModal();
    expect(result.current.errors).toEqual({});
  });
});

describe('useRegisterModal — form reset on close', () => {
  it('resets showPassword when open changes to false', async () => {
    const { result, rerender } = renderRegisterModal(true);

    act(() => result.current.setShowPassword(true));
    expect(result.current.showPassword).toBe(true);

    rerender({ open: false });

    await waitFor(() => expect(result.current.showPassword).toBe(false));
  });

  it('resets loading when open changes to false', async () => {
    const { result, rerender } = renderRegisterModal(true);

    rerender({ open: false });

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('canSubmit becomes false after reset', async () => {
    const { result, rerender } = renderRegisterModal(true);

    rerender({ open: false });

    await waitFor(() => expect(result.current.canSubmit).toBe(false));
  });
});

describe('EMAIL_PATTERN', () => {
  it.each([
    ['standard email', 'user@example.com', true],
    ['subdomain email', 'user@mail.example.com', true],
    ['plus-addressing', 'user+tag@example.com', true],
    ['missing @', 'userexample.com', false],
    ['missing domain', 'user@', false],
    ['missing TLD', 'user@example', false],
    ['empty string', '', false],
    ['spaces', 'user @example.com', false],
  ])('%s → %s', (_, email, expected) => {
    expect(EMAIL_PATTERN.test(email)).toBe(expected);
  });
});

describe('PASSWORD_PATTERN', () => {
  it.each([
    ['valid password', 'Password1!', true],
    ['valid with symbols', 'Str0ng@Pass', true],
    ['too short', 'Pa1!', false],
    ['no uppercase', 'password1!', false],
    ['no lowercase', 'PASSWORD1!', false],
    ['no digit', 'Password!!', false],
    ['no special character', 'Password1', false],
    ['empty string', '', false],
  ])('%s → %s', (_, password, expected) => {
    expect(PASSWORD_PATTERN.test(password)).toBe(expected);
  });
});

describe('useRegisterModal — showPassword', () => {
  it('toggles to true when setShowPassword is called with true', () => {
    const { result } = renderRegisterModal();
    act(() => result.current.setShowPassword(true));
    expect(result.current.showPassword).toBe(true);
  });

  it('toggles back to false when setShowPassword is called with false', () => {
    const { result } = renderRegisterModal();
    act(() => result.current.setShowPassword(true));
    act(() => result.current.setShowPassword(false));
    expect(result.current.showPassword).toBe(false);
  });
});

describe('useRegisterModal — handleSubmit failure', () => {
  it('sets loading to false after a failed submit', async () => {
    vi.spyOn(registerService, 'registerUser').mockRejectedValue(new Error('Server error'));
    const { result } = renderRegisterModal();
    await act(async () => result.current.handleSubmit(new Event('submit') as any));
    expect(result.current.loading).toBe(false);
  });
});
