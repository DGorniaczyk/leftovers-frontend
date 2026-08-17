import { useState, useEffect } from 'react';
import { isAuthenticated, subscribe } from '../auth/authService';

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    return subscribe(() => setAuthenticated(isAuthenticated()));
  }, []);

  return { isAuthenticated: authenticated };
}
