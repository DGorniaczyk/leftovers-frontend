import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRegisterModal } from './useRegisterModal';
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
  it('initialises with empty email and password', () => {
    const { result } = renderRegisterModal();
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
  });

  it('initialises with terms not accepted', () => {
    const { result } = renderRegisterModal();
    expect(result.current.termsAccepted).toBe(false);
  });

  it('initialises with password hidden', () => {
    const { result } = renderRegisterModal();
    expect(result.current.showPassword).toBe(false);
  });

  it('initialises not loading', () => {
    const { result } = renderRegisterModal();
    expect(result.current.loading).toBe(false);
  });

  it('initialises with canSubmit false', () => {
    const { result } = renderRegisterModal();
    expect(result.current.canSubmit).toBe(false);
  });
});

describe('useRegisterModal — form reset on close', () => {
  it('resets all fields when open changes from true to false', async () => {
    const { result, rerender } = renderRegisterModal(true);

    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('Password1!');
      result.current.setTermsAccepted(true);
      result.current.setShowPassword(true);
    });

    rerender({ open: false });

    await waitFor(() => {
      expect(result.current.email).toBe('');
      expect(result.current.password).toBe('');
      expect(result.current.termsAccepted).toBe(false);
      expect(result.current.showPassword).toBe(false);
      expect(result.current.loading).toBe(false);
    });
  });

  it('does not reset when open stays true', () => {
    const { result, rerender } = renderRegisterModal(true);

    act(() => {
      result.current.setEmail('test@example.com');
    });

    rerender({ open: true });

    expect(result.current.email).toBe('test@example.com');
  });
});

describe('useRegisterModal — emailValid', () => {
  it.each([
    ['standard email', 'user@example.com', true],
    ['subdomain email', 'user@mail.example.com', true],
    ['plus-addressing', 'user+tag@example.com', true],
    ['missing @', 'userexample.com', false],
    ['missing domain', 'user@', false],
    ['missing TLD', 'user@example', false],
    ['empty string', '', false],
    ['spaces', 'user @example.com', false],
  ])('%s → emailValid = %s', (_, email, expected) => {
    const { result } = renderRegisterModal();

    act(() => result.current.setEmail(email));

    expect(result.current.emailValid).toBe(expected);
  });
});

describe('useRegisterModal — passwordValid', () => {
  it.each([
    ['valid password', 'Password1!', true],
    ['valid with symbols', 'Str0ng@Pass', true],
    ['too short', 'Pa1!', false],
    ['no uppercase', 'password1!', false],
    ['no lowercase', 'PASSWORD1!', false],
    ['no digit', 'Password!!', false],
    ['no special character', 'Password1', false],
    ['empty string', '', false],
  ])('%s → passwordValid = %s', (_, password, expected) => {
    const { result } = renderRegisterModal();

    act(() => result.current.setPassword(password));

    expect(result.current.passwordValid).toBe(expected);
  });
});

describe('useRegisterModal — canSubmit', () => {
  function fillValidForm(result: ReturnType<typeof renderRegisterModal>['result']) {
    act(() => {
      result.current.setEmail('user@example.com');
      result.current.setPassword('Password1!');
      result.current.setTermsAccepted(true);
    });
  }

  it('is true when email, password are valid and terms are accepted', () => {
    const { result } = renderRegisterModal();
    fillValidForm(result);
    expect(result.current.canSubmit).toBe(true);
  });

  it('is false when email is invalid', () => {
    const { result } = renderRegisterModal();
    fillValidForm(result);
    act(() => result.current.setEmail('bad-email'));
    expect(result.current.canSubmit).toBe(false);
  });

  it('is false when password is invalid', () => {
    const { result } = renderRegisterModal();
    fillValidForm(result);
    act(() => result.current.setPassword('weak'));
    expect(result.current.canSubmit).toBe(false);
  });

  it('is false when terms are not accepted', () => {
    const { result } = renderRegisterModal();
    fillValidForm(result);
    act(() => result.current.setTermsAccepted(false));
    expect(result.current.canSubmit).toBe(false);
  });
});

describe('useRegisterModal — handleSubmit success', () => {
  async function submitValidForm() {
    const { result } = renderRegisterModal();

    act(() => {
      result.current.setEmail('user@example.com');
      result.current.setPassword('Password1!');
      result.current.setTermsAccepted(true);
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    return result;
  }

  it('calls registerUser with the entered email and password', async () => {
    await submitValidForm();
    expect(registerService.registerUser).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'Password1!',
    });
  });

  it('shows a success snackbar after registration', async () => {
    await submitValidForm();
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: expect.stringContaining("You've successfully registered"),
    });
  });

  it('calls onSuccess after registration', async () => {
    await submitValidForm();
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  it('resets the form after successful registration', async () => {
    const result = await submitValidForm();
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.termsAccepted).toBe(false);
  });

  it('is not loading after successful registration', async () => {
    const result = await submitValidForm();
    expect(result.current.loading).toBe(false);
  });
});

describe('useRegisterModal — handleSubmit failure', () => {
  beforeEach(() => {
    vi.spyOn(registerService, 'registerUser').mockRejectedValue(new Error('Server error')); // ← this one is fine, no change needed
  });

  async function submitAndFail() {
    const { result } = renderRegisterModal();

    act(() => {
      result.current.setEmail('user@example.com');
      result.current.setPassword('Password1!');
      result.current.setTermsAccepted(true);
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    return result;
  }

  it('shows an error snackbar when registration fails', async () => {
    await submitAndFail();
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'Registration failed. Please try again.',
    });
  });

  it('does not call onSuccess when registration fails', async () => {
    await submitAndFail();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('is not loading after a failed registration', async () => {
    const result = await submitAndFail();
    expect(result.current.loading).toBe(false);
  });
});

describe('useRegisterModal — handleSubmit guard', () => {
  it('does not call registerUser when canSubmit is false', async () => {
    const { result } = renderRegisterModal();

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(registerService.registerUser).not.toHaveBeenCalled();
  });
});
