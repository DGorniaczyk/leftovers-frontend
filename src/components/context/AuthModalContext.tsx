import { createContext, useContext, useState } from 'react';
import { RegisterModal } from '../auth/RegisterModal';
import { LoginModal } from '../auth/LoginModal';

interface AuthModalsContextValue {
  openRegister: () => void;
  openLogin: () => void;
}

const AuthModalsContext = createContext<AuthModalsContextValue | null>(null);

export function AuthModalsProvider({ children }: { children: React.ReactNode }) {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <AuthModalsContext.Provider
      value={{
        openRegister: () => setRegisterOpen(true),
        openLogin: () => setLoginOpen(true),
      }}
    >
      {children}
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />
    </AuthModalsContext.Provider>
  );
}

export function useAuthModals() {
  const ctx = useContext(AuthModalsContext);
  if (!ctx) throw new Error('useAuthModals must be used within AuthModalsProvider');
  return ctx;
}
