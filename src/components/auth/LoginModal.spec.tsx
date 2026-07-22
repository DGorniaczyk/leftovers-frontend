import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginModal } from './LoginModal';
import * as loginService from '../../api/auth/loginService';
import * as snackbarModule from '../common/Snackbar';
import * as authModalContext from '../context/AuthModalContext';

const mockShowSnackbar = vi.fn();
const mockOnClose = vi.fn();
const mockOnSwitchToRegister = vi.fn();
const mockOpenForgotPassword = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(snackbarModule, 'useSnackbar').mockReturnValue(mockShowSnackbar);
  vi.spyOn(loginService, 'loginUser').mockResolvedValue({ token: 'fake-token' });
  vi.spyOn(authModalContext, 'useAuthModals').mockReturnValue({
    openForgotPassword: mockOpenForgotPassword,
    openLogin: vi.fn(),
    openRegister: vi.fn(),
  });
});

function renderModal(open = true) {
  return render(
    <LoginModal open={open} onClose={mockOnClose} onSwitchToRegister={mockOnSwitchToRegister} />,
  );
}

function fillEmail(value: string) {
  fireEvent.change(screen.getByPlaceholderText('Enter your e-mail'), { target: { value } });
}

function fillPassword(value: string) {
  fireEvent.change(screen.getByPlaceholderText('Create a password'), { target: { value } });
}

async function fillValidForm() {
  fillEmail('user@example.com');
  fillPassword('anypassword');
  await waitFor(() => expect(screen.getByRole('button', { name: /log in/i })).toBeEnabled());
}

describe('LoginModal — rendering', () => {
  it('renders the Log in heading', () => {
    renderModal();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  it('renders the email field', () => {
    renderModal();
    expect(screen.getByPlaceholderText('Enter your e-mail')).toBeInTheDocument();
  });

  it('renders the password field', () => {
    renderModal();
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument();
  });

  it('renders the "Forgot your password?" button', () => {
    renderModal();
    expect(screen.getByRole('button', { name: /forgot your password/i })).toBeInTheDocument();
  });

  it('renders the Remember me checkbox', () => {
    renderModal();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders the Log in button', () => {
    renderModal();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('renders the "Create an account" button', () => {
    renderModal();
    expect(screen.getByRole('button', { name: /create an account/i })).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    renderModal(false);
    expect(screen.queryByText('Log in')).not.toBeInTheDocument();
  });
});

describe('LoginModal — submit button state', () => {
  it('is disabled initially', () => {
    renderModal();
    expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled();
  });

  it('remains disabled with only email filled', async () => {
    renderModal();
    fillEmail('user@example.com');
    await waitFor(() => expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled());
  });

  it('remains disabled with only password filled', async () => {
    renderModal();
    fillPassword('anypassword');
    await waitFor(() => expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled());
  });

  it('becomes enabled when both email and password are filled', async () => {
    renderModal();
    await fillValidForm();
    expect(screen.getByRole('button', { name: /log in/i })).toBeEnabled();
  });
});

// ── Password visibility ────────────────────────────────────────────────────────

describe('LoginModal — password visibility', () => {
  it('hides password by default', () => {
    renderModal();
    expect(screen.getByPlaceholderText('Create a password')).toHaveAttribute('type', 'password');
  });

  it('reveals password when the toggle is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /toggle password visibility/i }));
    expect(screen.getByPlaceholderText('Create a password')).toHaveAttribute('type', 'text');
  });
});

describe('LoginModal — submission', () => {
  it('shows a spinner while loading', async () => {
    vi.spyOn(loginService, 'loginUser').mockImplementation(() => new Promise(() => {}));
    renderModal();
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());
  });

  it('calls onClose after successful login', async () => {
    renderModal();
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() => expect(mockOnClose).toHaveBeenCalledTimes(1));
  });

  it('shows an error snackbar when login fails', async () => {
    vi.spyOn(loginService, 'loginUser').mockRejectedValue(new Error('Unauthorized'));
    renderModal();
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() =>
      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: 'Login failed. Please check your credentials and try again.',
      }),
    );
  });
});

describe('LoginModal — navigation', () => {
  it('calls onClose and openForgotPassword when "Forgot your password?" is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /forgot your password/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOpenForgotPassword).toHaveBeenCalledTimes(1);
  });

  it('calls onSwitchToRegister when "Create an account" is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /create an account/i }));
    expect(mockOnSwitchToRegister).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the X button is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
