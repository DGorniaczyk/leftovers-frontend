import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './hooks/useAuth';
import * as authService from '../src/api/auth/authService';

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(authService, 'subscribe').mockReturnValue(() => {});
  vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
});

describe('useAuth — initial state', () => {
  it('returns isLoggedIn: false when no token exists', () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoggedIn).toBe(false);
  });

  it('returns isLoggedIn: true when a token already exists', () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoggedIn).toBe(true);
  });
});

describe('useAuth — auth:changed subscription', () => {
  it('subscribes on mount', () => {
    renderHook(() => useAuth());
    expect(authService.subscribe).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes on unmount', () => {
    const unsubscribe = vi.fn();
    vi.spyOn(authService, 'subscribe').mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useAuth());
    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('sets isLoggedIn to true when auth callback fires after login', () => {
    let authCallback: () => void = () => {};
    vi.spyOn(authService, 'subscribe').mockImplementation((fn) => {
      authCallback = fn;
      return () => {};
    });
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);

    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoggedIn).toBe(false);

    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    act(() => authCallback());

    expect(result.current.isLoggedIn).toBe(true);
  });

  it('sets isLoggedIn to false when auth callback fires after logout', () => {
    let authCallback: () => void = () => {};
    vi.spyOn(authService, 'subscribe').mockImplementation((fn) => {
      authCallback = fn;
      return () => {};
    });
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);

    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoggedIn).toBe(true);

    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
    act(() => authCallback());

    expect(result.current.isLoggedIn).toBe(false);
  });
});

describe('useAuth — cross-tab storage sync', () => {
  it('sets isLoggedIn to true when jwt is set in another tab', () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
    const { result } = renderHook(() => useAuth());

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'jwt', newValue: 'some-token' }));
    });

    expect(result.current.isLoggedIn).toBe(true);
  });

  it('sets isLoggedIn to false when jwt is removed in another tab', () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    const { result } = renderHook(() => useAuth());

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'jwt', newValue: null }));
    });

    expect(result.current.isLoggedIn).toBe(false);
  });

  it('ignores storage events for unrelated keys', () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
    const { result } = renderHook(() => useAuth());

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'dark' }));
    });

    expect(result.current.isLoggedIn).toBe(false);
  });

  it('removes the storage listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useAuth());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
  });
});
