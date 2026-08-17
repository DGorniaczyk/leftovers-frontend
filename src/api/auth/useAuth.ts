import { useState, useEffect } from 'react';
import { isAuthenticated, subscribe } from '../auth/authService';

export function useAuth() {
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    return subscribe(() => setAuthenticated(isAuthenticated()));
  }, []);

  return { isAuthenticated: authenticated };
}
