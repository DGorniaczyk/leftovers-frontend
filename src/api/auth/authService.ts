const TOKEN_KEY = 'jwt';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event('auth:changed'));
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event('auth:changed'));
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function subscribe(fn: () => void) {
  const handler = () => fn();
  window.addEventListener('auth:changed', handler);
  return () => window.removeEventListener('auth:changed', handler);
}
