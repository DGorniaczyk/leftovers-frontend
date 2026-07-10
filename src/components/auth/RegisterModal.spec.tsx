import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RegisterModal } from './RegisterModal';
import * as useRegisterModalModule from './useRegisterModal';

const mockSetEmail = vi.fn();
const mockSetPassword = vi.fn();
const mockSetTermsAccepted = vi.fn();
const mockSetShowPassword = vi.fn();
const mockHandleSubmit = vi.fn();
const mockOnClose = vi.fn();

const defaultHookReturn = {
  email: '',
  setEmail: mockSetEmail,
  password: '',
  setPassword: mockSetPassword,
  termsAccepted: false,
  setTermsAccepted: mockSetTermsAccepted,
  showPassword: false,
  setShowPassword: mockSetShowPassword,
  loading: false,
  emailValid: true,
  passwordValid: true,
  canSubmit: false,
  handleSubmit: mockHandleSubmit,
};

function renderModal(open = true) {
  return render(<RegisterModal open={open} onClose={mockOnClose} />);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(useRegisterModalModule, 'useRegisterModal').mockReturnValue(defaultHookReturn);
});

describe('RegisterModal — rendering', () => {
  it('renders the Sign up heading', () => {
    renderModal();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    renderModal();
    expect(screen.getByText('Create an account for free')).toBeInTheDocument();
  });

  it('renders the email field', () => {
    renderModal();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('renders the password field', () => {
    renderModal();
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument();
  });

  it('renders the terms checkbox', () => {
    renderModal();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders Terms & conditions link pointing to /tos opening in a new tab', () => {
    renderModal();
    const link = screen.getByRole('link', { name: /terms & conditions/i });
    expect(link).toHaveAttribute('href', '/tos');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders Privacy Policy link pointing to /privacy opening in a new tab', () => {
    renderModal();
    const link = screen.getByRole('link', { name: /privacy policy/i });
    expect(link).toHaveAttribute('href', '/privacy');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the "Create an account" button', () => {
    renderModal();
    expect(screen.getByRole('button', { name: /create an account/i })).toBeInTheDocument();
  });

  it('renders the login link pointing to /login', () => {
    renderModal();
    const link = screen.getByRole('link', { name: /login/i });
    expect(link).toHaveAttribute('href', '/login');
  });

  it('does not render when open is false', () => {
    renderModal(false);
    expect(screen.queryByText('Sign up')).not.toBeInTheDocument();
  });
});

describe('RegisterModal — email field', () => {
  it('calls setEmail when the user types', () => {
    renderModal();
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    });
    expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('does not show email error when email is empty', () => {
    vi.spyOn(useRegisterModalModule, 'useRegisterModal').mockReturnValue({
      ...defaultHookReturn,
      email: '',
      emailValid: false,
    });
    renderModal();
    expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument();
  });

  it('shows email error when email is non-empty and invalid', () => {
    vi.spyOn(useRegisterModalModule, 'useRegisterModal').mockReturnValue({
      ...defaultHookReturn,
      email: 'not-an-email',
      emailValid: false,
    });
    renderModal();
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
  });

  it('does not show email error when email is valid', () => {
    vi.spyOn(useRegisterModalModule, 'useRegisterModal').mockReturnValue({
      ...defaultHookReturn,
      email: 'valid@example.com',
      emailValid: true,
    });
    renderModal();
    expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument();
  });
});

describe('RegisterModal — password field', () => {
  it('calls setPassword when the user types', () => {
    renderModal();
    fireEvent.change(screen.getByPlaceholderText('Create a password'), {
      target: { value: 'Secret1!' },
    });
    expect(mockSetPassword).toHaveBeenCalledWith('Secret1!');
  });

  it('renders the password input as type="password" by default', () => {
    renderModal();
    expect(screen.getByPlaceholderText('Create a password')).toHaveAttribute('type', 'password');
  });

  it('renders the password input as type="text" when showPassword is true', () => {
    vi.spyOn(useRegisterModalModule, 'useRegisterModal').mockReturnValue({
      ...defaultHookReturn,
      showPassword: true,
    });
    renderModal();
    expect(screen.getByPlaceholderText('Create a password')).toHaveAttribute('type', 'text');
  });

  it('calls setShowPassword when the visibility toggle is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /toggle password visibility/i }));
    expect(mockSetShowPassword).toHaveBeenCalledTimes(1);
  });

  it('does not show password error when password is empty', () => {
    vi.spyOn(useRegisterModalModule, 'useRegisterModal').mockReturnValue({
      ...defaultHookReturn,
      password: '',
      passwordValid: false,
    });
    renderModal();
    expect(screen.queryByText(/use at least 8 characters/i)).not.toBeInTheDocument();
  });

  it('shows password error when password is non-empty and invalid', () => {
    vi.spyOn(useRegisterModalModule, 'useRegisterModal').mockReturnValue({
      ...defaultHookReturn,
      password: 'weak',
      passwordValid: false,
    });
    renderModal();
    expect(screen.getByText(/use at least 8 characters, including uppercase/i)).toBeInTheDocument();
  });

  it('does not show password error when password is valid', () => {
    vi.spyOn(useRegisterModalModule, 'useRegisterModal').mockReturnValue({
      ...defaultHookReturn,
      password: 'Valid1!abc',
      passwordValid: true,
    });
    renderModal();
    expect(screen.queryByText(/use at least 8 characters/i)).not.toBeInTheDocument();
  });
});

describe('RegisterModal — terms checkbox', () => {
  it('is unchecked by default', () => {
    renderModal();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('is checked when termsAccepted is true', () => {
    vi.spyOn(useRegisterModalModule, 'useRegisterModal').mockReturnValue({
      ...defaultHookReturn,
      termsAccepted: true,
    });
    renderModal();
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls setTermsAccepted when toggled', () => {
    renderModal();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockSetTermsAccepted).toHaveBeenCalledWith(true);
  });
});

describe('RegisterModal — submit button', () => {
  it('is disabled when canSubmit is false', () => {
    vi.spyOn(useRegisterModalModule, 'useRegisterModal').mockReturnValue({
      ...defaultHookReturn,
      canSubmit: false,
    });
    renderModal();
    expect(screen.getByRole('button', { name: /create an account/i })).toBeDisabled();
  });

  it('is enabled when canSubmit is true', () => {
    vi.spyOn(useRegisterModalModule, 'useRegisterModal').mockReturnValue({
      ...defaultHookReturn,
      canSubmit: true,
    });
    renderModal();
    expect(screen.getByRole('button', { name: /create an account/i })).toBeEnabled();
  });

  it('shows a spinner and no text when loading', () => {
    vi.spyOn(useRegisterModalModule, 'useRegisterModal').mockReturnValue({
      ...defaultHookReturn,
      loading: true,
    });
    renderModal();
    expect(screen.queryByText('Create an account')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('calls handleSubmit when clicked and canSubmit is true', () => {
    vi.spyOn(useRegisterModalModule, 'useRegisterModal').mockReturnValue({
      ...defaultHookReturn,
      canSubmit: true,
    });
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /create an account/i }));
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });
});

describe('RegisterModal — close button', () => {
  it('calls onClose when the X button is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe('RegisterModal — hook wiring', () => {
  it('passes open and onClose (as onSuccess) to useRegisterModal', () => {
    const spy = vi
      .spyOn(useRegisterModalModule, 'useRegisterModal')
      .mockReturnValue(defaultHookReturn);
    renderModal(true);
    expect(spy).toHaveBeenCalledWith({ open: true, onSuccess: mockOnClose });
  });
});
