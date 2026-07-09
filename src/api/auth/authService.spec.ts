import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getToken, setToken, removeToken, isAuthenticated, subscribe } from './authService';

function dispatchAuthChanged() {
  window.dispatchEvent(new Event('auth:changed'));
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('getToken', () => {
  it('returns null when no token is stored', () => {
    expect(getToken()).toBeNull();
  });

  it('returns the stored token', () => {
    localStorage.setItem('jwt', 'abc123');
    expect(getToken()).toBe('abc123');
  });

  it('returns null when window is undefined (SSR)', () => {
    const original = globalThis.window;
    // @ts-expect-error — simulating SSR environment
    delete globalThis.window;

    expect(getToken()).toBeNull();

    globalThis.window = original;
  });
});

describe('setToken', () => {
  it('stores the token in localStorage', () => {
    setToken('my-token');
    expect(localStorage.getItem('jwt')).toBe('my-token');
  });

  it('overwrites an existing token', () => {
    setToken('old-token');
    setToken('new-token');
    expect(localStorage.getItem('jwt')).toBe('new-token');
  });

  it('dispatches the auth:changed event', () => {
    const listener = vi.fn();
    window.addEventListener('auth:changed', listener);

    setToken('my-token');

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener('auth:changed', listener);
  });
});

describe('removeToken', () => {
  it('removes the token from localStorage', () => {
    localStorage.setItem('jwt', 'abc123');
    removeToken();
    expect(localStorage.getItem('jwt')).toBeNull();
  });

  it('does not throw when there is no token to remove', () => {
    expect(() => removeToken()).not.toThrow();
  });

  it('dispatches the auth:changed event', () => {
    const listener = vi.fn();
    window.addEventListener('auth:changed', listener);

    removeToken();

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener('auth:changed', listener);
  });
});

describe('isAuthenticated', () => {
  it('returns false when no token is stored', () => {
    expect(isAuthenticated()).toBe(false);
  });

  it('returns true when a token is stored', () => {
    setToken('abc123');
    expect(isAuthenticated()).toBe(true);
  });

  it('returns false after the token is removed', () => {
    setToken('abc123');
    removeToken();
    expect(isAuthenticated()).toBe(false);
  });
});

describe('subscribe', () => {
  it('calls the callback when auth:changed is dispatched', () => {
    const fn = vi.fn();
    subscribe(fn);

    dispatchAuthChanged();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('calls the callback each time the event fires', () => {
    const fn = vi.fn();
    subscribe(fn);

    dispatchAuthChanged();
    dispatchAuthChanged();
    dispatchAuthChanged();

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('stops calling the callback after unsubscribing', () => {
    const fn = vi.fn();
    const unsubscribe = subscribe(fn);

    dispatchAuthChanged();
    unsubscribe();
    dispatchAuthChanged();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('returns an unsubscribe function', () => {
    const unsubscribe = subscribe(vi.fn());
    expect(typeof unsubscribe).toBe('function');
  });

  it('does not affect other subscribers when one unsubscribes', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const unsubscribe1 = subscribe(fn1);
    subscribe(fn2);

    unsubscribe1();
    dispatchAuthChanged();

    expect(fn1).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  it('calls the callback when setToken triggers auth:changed', () => {
    const fn = vi.fn();
    subscribe(fn);

    setToken('abc123');

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('calls the callback when removeToken triggers auth:changed', () => {
    const fn = vi.fn();
    subscribe(fn);

    removeToken();

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
