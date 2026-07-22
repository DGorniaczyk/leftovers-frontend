import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { NewPasswordModal } from './NewPasswordModal';
import * as resetPasswordService from '../../api/auth/resetPasswordService';
import * as snackbarModule from '../common/Snackbar';
import * as authModalContext from '../context/AuthModalContext';

const mockShowSnackbar = vi.fn();
const mockOnClose = vi.fn();
const mockOpenLogin = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(snackbarModule, 'useSnackbar').mockReturnValue(mockShowSnackbar);
  vi.spyOn(resetPasswordService, 'setNewPassword').mockResolvedValue('Password updated.');
  vi.spyOn(authModalContext, 'useAuthModals').mockReturnValue({
    openLogin: mockOpenLogin,
    openRegister: vi.fn(),
    openForgotPassword: vi.fn(),
  });
});

function renderModal(token = 'valid-token', open = true) {
  return render(
    <MemoryRouter initialEntries={[`/reset-password?token=${token}`]}>
      <NewPasswordModal open={open} onClose={mockOnClose} />
    </MemoryRouter>,
  );
}

function fillPassword(value: string) {
  fireEvent.change(screen.getByPlaceholderText('Type new password'), { target: { value } });
}

function fillConfirmPassword(value: string) {
  fireEvent.change(screen.getByPlaceholderText('Type new password again'), { target: { value } });
}

async function fillValidForm() {
  fillPassword('Password1!');
  fillConfirmPassword('Password1!');
  await waitFor(() =>
    expect(screen.getByRole('button', { name: /reset my password/i })).toBeEnabled(),
  );
}

describe('NewPasswordModal — rendering', () => {
  it('renders the heading, both fields, cancel and submit buttons', () => {
    renderModal();
    expect(screen.getByText('New password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type new password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type new password again')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset my password/i })).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    renderModal('valid-token', false);
    expect(screen.queryByText('New password')).not.toBeInTheDocument();
  });
});

describe('NewPasswordModal — submit button state', () => {
  it('is disabled initially', () => {
    renderModal();
    expect(screen.getByRole('button', { name: /reset my password/i })).toBeDisabled();
  });

  it('is disabled when token is missing', async () => {
    renderModal('');
    await fillValidForm().catch(() => {});
    expect(screen.getByRole('button', { name: /reset my password/i })).toBeDisabled();
  });

  it('remains disabled when passwords do not match', async () => {
    renderModal();
    fillPassword('Password1!');
    fillConfirmPassword('Different1!');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /reset my password/i })).toBeDisabled(),
    );
  });

  it('becomes enabled when both passwords match and are valid', async () => {
    renderModal();
    await fillValidForm();
    expect(screen.getByRole('button', { name: /reset my password/i })).toBeEnabled();
  });
});

describe('NewPasswordModal — password visibility', () => {
  it('toggles new password visibility', () => {
    renderModal();
    const input = screen.getByPlaceholderText('Type new password');
    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: /toggle password visibility/i }));
    expect(input).toHaveAttribute('type', 'text');
  });

  it('toggles confirm password visibility', () => {
    renderModal();
    const input = screen.getByPlaceholderText('Type new password again');
    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: /toggle confirm password visibility/i }));
    expect(input).toHaveAttribute('type', 'text');
  });
});

describe('NewPasswordModal — validation', () => {
  it('shows an error when passwords do not match', async () => {
    renderModal();
    fillPassword('Password1!');
    fillConfirmPassword('Different1!');
    fireEvent.blur(screen.getByPlaceholderText('Type new password again'));
    await waitFor(() => expect(screen.getByText('Passwords do not match.')).toBeInTheDocument());
  });

  it('shows a password strength error for a weak password', async () => {
    renderModal();
    fillPassword('weak');
    fireEvent.blur(screen.getByPlaceholderText('Type new password'));
    await waitFor(() => expect(screen.getByText(/use at least 8 characters/i)).toBeInTheDocument());
  });
});

describe('NewPasswordModal — submission', () => {
  it('shows a spinner while loading', async () => {
    vi.spyOn(resetPasswordService, 'setNewPassword').mockImplementation(
      () => new Promise(() => {}),
    );
    renderModal();
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /reset my password/i }));
    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());
  });

  it('shows a success snackbar and opens login on success', async () => {
    renderModal();
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /reset my password/i }));
    await waitFor(() => {
      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: expect.stringContaining('Password changed successfully'),
      });
      expect(mockOpenLogin).toHaveBeenCalledTimes(1);
    });
  });

  it('shows an error snackbar when the request fails', async () => {
    vi.spyOn(resetPasswordService, 'setNewPassword').mockRejectedValue(new Error('Token expired'));
    renderModal();
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /reset my password/i }));
    await waitFor(() =>
      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: 'Something went wrong. Please try again.',
      }),
    );
  });
});

describe('NewPasswordModal — close', () => {
  it('calls onClose when X is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Cancel is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
