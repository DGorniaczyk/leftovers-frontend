import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterModal } from './RegisterModal';
import * as registerService from '../../api/auth/registerService';
import * as snackbarModule from '../common/Snackbar';

const mockShowSnackbar = vi.fn();
const mockOnClose = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(snackbarModule, 'useSnackbar').mockReturnValue(mockShowSnackbar);
  vi.spyOn(registerService, 'registerUser').mockResolvedValue('');
});

function renderModal(open = true) {
  return render(<RegisterModal open={open} onClose={mockOnClose} />);
}

function fillEmail(value: string) {
  fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
    target: { value },
  });
}

function fillPassword(value: string) {
  fireEvent.change(screen.getByPlaceholderText('Create a password'), {
    target: { value },
  });
}

function acceptTerms() {
  fireEvent.click(screen.getByRole('checkbox'));
}

async function fillValidForm() {
  fillEmail('user@example.com');
  fillPassword('Password1!');
  acceptTerms();
  await waitFor(() =>
    expect(screen.getByRole('button', { name: /create an account/i })).toBeEnabled(),
  );
}

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

  it('renders Terms & conditions link pointing to /tos in a new tab', () => {
    renderModal();
    const link = screen.getByRole('link', { name: /terms & conditions/i });
    expect(link).toHaveAttribute('href', '/tos');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders Privacy Policy link pointing to /privacy in a new tab', () => {
    renderModal();
    const link = screen.getByRole('link', { name: /privacy policy/i });
    expect(link).toHaveAttribute('href', '/privacy');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the submit button', () => {
    renderModal();
    expect(screen.getByRole('button', { name: /create an account/i })).toBeInTheDocument();
  });

  it('renders the login link pointing to /login', () => {
    renderModal();
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
  });

  it('does not render when open is false', () => {
    renderModal(false);
    expect(screen.queryByText('Sign up')).not.toBeInTheDocument();
  });
});

describe('RegisterModal — email validation', () => {
  it('shows no error before the user types anything', () => {
    renderModal();
    expect(screen.queryByText(/enter a valid email/i)).not.toBeInTheDocument();
  });

  it('shows an error for an invalid email after the field loses focus', async () => {
    renderModal();
    fillEmail('not-an-email');
    fireEvent.blur(screen.getByPlaceholderText('Enter your email'));
    await waitFor(() => expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument());
  });

  it('clears the error when a valid email is entered', async () => {
    renderModal();
    fillEmail('bad');
    fireEvent.blur(screen.getByPlaceholderText('Enter your email'));
    await waitFor(() => screen.getByText(/enter a valid email/i));

    fillEmail('good@example.com');
    await waitFor(() => expect(screen.queryByText(/enter a valid email/i)).not.toBeInTheDocument());
  });
});

describe('RegisterModal — password validation', () => {
  it('shows an error for a weak password after the field loses focus', async () => {
    renderModal();
    fillPassword('weak');
    fireEvent.blur(screen.getByPlaceholderText('Create a password'));
    await waitFor(() => expect(screen.getByText(/use at least 8 characters/i)).toBeInTheDocument());
  });

  it('clears the error when a valid password is entered', async () => {
    renderModal();
    fillPassword('weak');
    fireEvent.blur(screen.getByPlaceholderText('Create a password'));
    await waitFor(() => screen.getByText(/use at least 8 characters/i));

    fillPassword('Password1!');
    await waitFor(() =>
      expect(screen.queryByText(/use at least 8 characters/i)).not.toBeInTheDocument(),
    );
  });

  it('toggles password visibility when the eye icon is clicked', async () => {
    renderModal();
    const input = screen.getByPlaceholderText('Create a password');
    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: /toggle password visibility/i }));
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button', { name: /toggle password visibility/i }));
    expect(input).toHaveAttribute('type', 'password');
  });
});

describe('RegisterModal — submit button state', () => {
  it('is disabled initially', () => {
    renderModal();
    expect(screen.getByRole('button', { name: /create an account/i })).toBeDisabled();
  });

  it('remains disabled with only a valid email', async () => {
    renderModal();
    fillEmail('user@example.com');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /create an account/i })).toBeDisabled(),
    );
  });

  it('remains disabled with valid email and password but no terms', async () => {
    renderModal();
    fillEmail('user@example.com');
    fillPassword('Password1!');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /create an account/i })).toBeDisabled(),
    );
  });

  it('becomes enabled when email, password and terms are all valid', async () => {
    renderModal();
    await fillValidForm();
    expect(screen.getByRole('button', { name: /create an account/i })).toBeEnabled();
  });

  it('becomes disabled again if the email is cleared after being valid', async () => {
    renderModal();
    await fillValidForm();
    fillEmail('');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /create an account/i })).toBeDisabled(),
    );
  });
});

describe('RegisterModal — form submission', () => {
  it('calls registerUser with the entered credentials', async () => {
    renderModal();
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /create an account/i }));

    await waitFor(() =>
      expect(registerService.registerUser).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Password1!',
      }),
    );
  });

  it('shows a success snackbar after registration', async () => {
    renderModal();
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /create an account/i }));

    await waitFor(() =>
      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: expect.stringContaining("You've successfully registered"),
      }),
    );
  });

  it('calls onClose after successful registration', async () => {
    renderModal();
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /create an account/i }));

    await waitFor(() => expect(mockOnClose).toHaveBeenCalledTimes(1));
  });

  it('shows a spinner while loading and hides the button label', async () => {
    vi.spyOn(registerService, 'registerUser').mockImplementation(() => new Promise(() => {}));
    renderModal();
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /create an account/i }));

    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());
    expect(screen.queryByText('Create an account')).not.toBeInTheDocument();
  });

  it('shows an error snackbar when registration fails', async () => {
    vi.spyOn(registerService, 'registerUser').mockRejectedValue(new Error('Server error'));
    renderModal();
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /create an account/i }));

    await waitFor(() =>
      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: 'Registration failed. Please try again.',
      }),
    );
  });

  it('does not call onClose when registration fails', async () => {
    vi.spyOn(registerService, 'registerUser').mockRejectedValue(new Error('Server error'));
    renderModal();
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /create an account/i }));

    await waitFor(() => expect(mockShowSnackbar).toHaveBeenCalled());
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});

describe('RegisterModal — close button', () => {
  it('calls onClose when the X button is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
