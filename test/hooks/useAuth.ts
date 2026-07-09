import { useEffect, useState } from 'react';
import { isAuthenticated, subscribe } from '../../src/api/auth/authService';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    const unsubscribe = subscribe(() => setIsLoggedIn(isAuthenticated()));

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'jwt') setIsLoggedIn(Boolean(e.newValue));
    };

    window.addEventListener('storage', onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return { isLoggedIn };
}
