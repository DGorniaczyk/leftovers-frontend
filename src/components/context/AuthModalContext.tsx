import { createContext, useContext, useState } from 'react';
import { RegisterModal } from '../auth/RegisterModal';
import { LoginModal } from '../auth/LoginModal';
import { ForgotPasswordModal } from '../auth/ForgotPasswordModal';

interface AuthModalsContextValue {
  openRegister: () => void;
  openLogin: () => void;
  openForgotPassword: () => void;
}

const AuthModalsContext = createContext<AuthModalsContextValue | null>(null);

export function AuthModalsProvider({ children }: { children: React.ReactNode }) {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  return (
    <AuthModalsContext.Provider
      value={{
        openRegister: () => setRegisterOpen(true),
        openLogin: () => setLoginOpen(true),
        openForgotPassword: () => setForgotPasswordOpen(true),
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
      <ForgotPasswordModal open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} />
    </AuthModalsContext.Provider>
  );
}

export function useAuthModals() {
  const context = useContext(AuthModalsContext);
  if (!context) throw new Error('useAuthModals must be used within AuthModalsProvider');
  return context;
}
