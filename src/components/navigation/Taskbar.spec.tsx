import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Taskbar from './Taskbar';
import * as categoriesApi from '../../api/categories';
import * as authService from '../../api/auth/authService';

vi.mock('../../assets/logo.svg', () => ({ default: 'logo.svg' }));
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockNavigate = vi.fn();

const MOCK_CATEGORIES = [
  { value: 'all', label: '🍽️ All recipes' },
  { value: 'BREAKFAST', label: '🥪 Breakfasts' },
  { value: 'LUNCH', label: '🍔 Lunch' },
];

function renderTaskbar() {
  return render(
    <MemoryRouter>
      <Taskbar />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(categoriesApi, 'fetchCategories').mockResolvedValue(MOCK_CATEGORIES);
  vi.spyOn(authService, 'subscribe').mockReturnValue(() => {});
  vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
  vi.spyOn(authService, 'removeToken').mockImplementation(() => {});
});

describe('Taskbar integration — auth state drives UI', () => {
  it('shows guest nav when logged out', () => {
    renderTaskbar();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /my account/i })).not.toBeInTheDocument();
  });

  it('shows authenticated nav when logged in', () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    renderTaskbar();
    expect(screen.getByRole('button', { name: /my account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ add recipe/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();
  });

  it('switches from guest to authenticated UI when auth event fires', async () => {
    let authCallback: () => void = () => {};
    vi.spyOn(authService, 'subscribe').mockImplementation((fn) => {
      authCallback = fn;
      return () => {};
    });
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);

    renderTaskbar();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();

    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    fireEvent(window, new Event('auth:changed'));
    authCallback();

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /my account/i })).toBeInTheDocument();
    });
  });

  it('switches to guest UI when token is removed from another tab', async () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    renderTaskbar();

    fireEvent(window, new StorageEvent('storage', { key: 'jwt', newValue: null }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });
  });
});

describe('Taskbar integration — categories in Recipes menu', () => {
  it('shows fetched categories when Recipes menu is opened', async () => {
    renderTaskbar();

    fireEvent.click(screen.getByRole('button', { name: /recipes/i }));

    await waitFor(() => {
      MOCK_CATEGORIES.forEach(({ label }) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });
  });

  it('shows no categories while loading', () => {
    // Never resolves during this test
    vi.spyOn(categoriesApi, 'fetchCategories').mockReturnValue(new Promise(() => {}));
    renderTaskbar();

    fireEvent.click(screen.getByRole('button', { name: /recipes/i }));

    expect(screen.queryByText('🥪 Breakfasts')).not.toBeInTheDocument();
  });

  it('shows an empty menu when fetch returns no categories', async () => {
    vi.spyOn(categoriesApi, 'fetchCategories').mockResolvedValue([]);
    renderTaskbar();

    fireEvent.click(screen.getByRole('button', { name: /recipes/i }));

    await waitFor(() => {
      expect(screen.queryByText('🥪 Breakfasts')).not.toBeInTheDocument();
    });
  });
});

describe('Taskbar integration — logout flow', () => {
  beforeEach(() => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
  });

  it('calls removeToken, closes the menu, and navigates to / on logout', async () => {
    renderTaskbar();

    fireEvent.click(screen.getByRole('button', { name: /my account/i }));
    await waitFor(() => screen.getByText('Log out'));
    fireEvent.click(screen.getByText('Log out'));

    expect(authService.removeToken).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
    await waitFor(() => {
      expect(screen.queryByText('Log out')).not.toBeInTheDocument();
    });
  });
});

describe('Taskbar integration — navigation flows', () => {
  beforeEach(() => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
  });

  it('navigates to /saved from the account menu', async () => {
    renderTaskbar();

    fireEvent.click(screen.getByRole('button', { name: /my account/i }));
    await waitFor(() => screen.getByText('Saved recipes'));
    fireEvent.click(screen.getByText('Saved recipes'));

    expect(mockNavigate).toHaveBeenCalledWith('/saved');
  });

  it('navigates to /my-recipes from the account menu', async () => {
    renderTaskbar();

    fireEvent.click(screen.getByRole('button', { name: /my account/i }));
    await waitFor(() => screen.getByText('My recipes'));
    fireEvent.click(screen.getByText('My recipes'));

    expect(mockNavigate).toHaveBeenCalledWith('/my-recipes');
  });

  it('closes the account menu after navigating', async () => {
    renderTaskbar();

    fireEvent.click(screen.getByRole('button', { name: /my account/i }));
    await waitFor(() => screen.getByText('Saved recipes'));
    fireEvent.click(screen.getByText('Saved recipes'));

    await waitFor(() => {
      expect(screen.queryByText('Saved recipes')).not.toBeInTheDocument();
    });
  });
});
