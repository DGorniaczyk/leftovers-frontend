import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { useNewPasswordModal } from './useNewPasswordModal';
import * as resetPasswordService from '../../api/auth/resetPasswordService';
import * as snackbarModule from '../common/Snackbar';
import * as authModalContext from '../context/AuthModalContext';

const mockShowSnackbar = vi.fn();
const mockOnClose = vi.fn();
const mockOpenLogin = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(snackbarModule, 'useSnackbar').mockReturnValue(mockShowSnackbar);
  vi.spyOn(authModalContext, 'useAuthModals').mockReturnValue({
    openLogin: mockOpenLogin,
    openRegister: vi.fn(),
    openForgotPassword: vi.fn(),
  });
  vi.spyOn(resetPasswordService, 'setNewPassword').mockResolvedValue(
    'Password updated successfully.',
  );
});

function renderNewPasswordModal(token = 'valid-token') {
  const wrapper = (props) => (
    <MemoryRouter initialEntries={[`/reset-password?token=${token}`]}>
      {props.children}
    </MemoryRouter>
  );

  return renderHook(() => useNewPasswordModal({ onClose: mockOnClose }), { wrapper });
}

it('returns an empty token when none is in the URL', () => {
  const wrapper = (props: React.PropsWithChildren) => (
    <MemoryRouter initialEntries={['/reset-password']}>{props.children}</MemoryRouter>
  );

  const { result } = renderHook(() => useNewPasswordModal({ onClose: mockOnClose }), { wrapper });
  expect(result.current.token).toBe('');
});

it('initialises with password hidden', () => {
  const { result } = renderNewPasswordModal();
  expect(result.current.showPassword).toBe(false);
});

it('initialises with confirm password hidden', () => {
  const { result } = renderNewPasswordModal();
  expect(result.current.showConfirmPassword).toBe(false);
});

it('initialises not loading', () => {
  const { result } = renderNewPasswordModal();
  expect(result.current.loading).toBe(false);
});

it('initialises with isValid false', () => {
  const { result } = renderNewPasswordModal();
  expect(result.current.isValid).toBe(false);
});

it('exposes PASSWORD_PATTERN as a RegExp', () => {
  const { result } = renderNewPasswordModal();
  expect(result.current.PASSWORD_PATTERN).toBeInstanceOf(RegExp);
});

describe('useNewPasswordModal — PASSWORD_PATTERN', () => {
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
    const { result } = renderNewPasswordModal();
    expect(result.current.PASSWORD_PATTERN.test(password)).toBe(expected);
  });
});

describe('useNewPasswordModal — visibility toggles', () => {
  it('toggles showPassword to true', () => {
    const { result } = renderNewPasswordModal();
    act(() => result.current.setShowPassword(true));
    expect(result.current.showPassword).toBe(true);
  });

  it('toggles showPassword back to false', () => {
    const { result } = renderNewPasswordModal();
    act(() => result.current.setShowPassword(true));
    act(() => result.current.setShowPassword(false));
    expect(result.current.showPassword).toBe(false);
  });

  it('toggles showConfirmPassword to true', () => {
    const { result } = renderNewPasswordModal();
    act(() => result.current.setShowConfirmPassword(true));
    expect(result.current.showConfirmPassword).toBe(true);
  });

  it('toggles showConfirmPassword back to false', () => {
    const { result } = renderNewPasswordModal();
    act(() => result.current.setShowConfirmPassword(true));
    act(() => result.current.setShowConfirmPassword(false));
    expect(result.current.showConfirmPassword).toBe(false);
  });
});

describe('useNewPasswordModal — handleClose', () => {
  it('calls onClose', () => {
    const { result } = renderNewPasswordModal();
    act(() => result.current.handleClose());
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('resets showPassword', () => {
    const { result } = renderNewPasswordModal();
    act(() => result.current.setShowPassword(true));
    act(() => result.current.handleClose());
    expect(result.current.showPassword).toBe(false);
  });

  it('resets showConfirmPassword', () => {
    const { result } = renderNewPasswordModal();
    act(() => result.current.setShowConfirmPassword(true));
    act(() => result.current.handleClose());
    expect(result.current.showConfirmPassword).toBe(false);
  });
});

describe('useNewPasswordModal — onSubmit success', () => {
  it('calls setNewPassword with the token and password', async () => {
    const { result } = renderNewPasswordModal('my-token');

    await act(async () => {
      await result.current.onSubmit({ password: 'Password1!', confirmPassword: 'Password1!' });
    });

    expect(resetPasswordService.setNewPassword).toHaveBeenCalledWith({
      token: 'my-token',
      password: 'Password1!',
    });
  });

  it('shows the success snackbar', async () => {
    const { result } = renderNewPasswordModal();

    await act(async () => {
      await result.current.onSubmit({ password: 'Password1!', confirmPassword: 'Password1!' });
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: expect.stringContaining('Password changed successfully'),
    });
  });

  it('calls handleClose after success', async () => {
    const { result } = renderNewPasswordModal();

    await act(async () => {
      await result.current.onSubmit({ password: 'Password1!', confirmPassword: 'Password1!' });
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls openLogin after success', async () => {
    const { result } = renderNewPasswordModal();

    await act(async () => {
      await result.current.onSubmit({ password: 'Password1!', confirmPassword: 'Password1!' });
    });

    expect(mockOpenLogin).toHaveBeenCalledTimes(1);
  });

  it('is not loading after success', async () => {
    const { result } = renderNewPasswordModal();

    await act(async () => {
      await result.current.onSubmit({ password: 'Password1!', confirmPassword: 'Password1!' });
    });

    expect(result.current.loading).toBe(false);
  });
});

describe('useNewPasswordModal — onSubmit failure', () => {
  beforeEach(() => {
    vi.spyOn(resetPasswordService, 'setNewPassword').mockRejectedValue(new Error('Token expired'));
  });

  it('shows an error snackbar when the request fails', async () => {
    const { result } = renderNewPasswordModal();

    await act(async () => {
      await result.current.onSubmit({ password: 'Password1!', confirmPassword: 'Password1!' });
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'Something went wrong. Please try again.',
    });
  });

  it('does not call onClose when the request fails', async () => {
    const { result } = renderNewPasswordModal();

    await act(async () => {
      await result.current.onSubmit({ password: 'Password1!', confirmPassword: 'Password1!' });
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('does not call openLogin when the request fails', async () => {
    const { result } = renderNewPasswordModal();

    await act(async () => {
      await result.current.onSubmit({ password: 'Password1!', confirmPassword: 'Password1!' });
    });

    expect(mockOpenLogin).not.toHaveBeenCalled();
  });

  it('is not loading after failure', async () => {
    const { result } = renderNewPasswordModal();

    await act(async () => {
      await result.current.onSubmit({ password: 'Password1!', confirmPassword: 'Password1!' });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});

describe('useNewPasswordModal — loading guard', () => {
  it('does not call setNewPassword if already loading', async () => {
    vi.spyOn(resetPasswordService, 'setNewPassword').mockImplementation(
      () => new Promise(() => {}), // never resolves
    );
    const { result } = renderNewPasswordModal();

    act(() => {
      result.current.onSubmit({ password: 'Password1!', confirmPassword: 'Password1!' });
    });

    await act(async () => {
      await result.current.onSubmit({ password: 'Password1!', confirmPassword: 'Password1!' });
    });

    expect(resetPasswordService.setNewPassword).toHaveBeenCalledTimes(1);
  });
});
