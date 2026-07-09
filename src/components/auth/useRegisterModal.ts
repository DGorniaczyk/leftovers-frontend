import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from '../common/Snackbar';
import { registerUser } from '../../api/auth/registerService';

interface UseRegisterModalProps {
  open: boolean;
  onSuccess?: () => void;
}

export function useRegisterModal({ open, onSuccess }: UseRegisterModalProps) {
  const showSnackbar = useSnackbar();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const passwordValid = useMemo(
    () => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password),
    [password],
  );

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setTermsAccepted(false);
    setShowPassword(false);
    setLoading(false);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const canSubmit = emailValid && passwordValid && termsAccepted && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setLoading(true);
      await registerUser({
        email,
        password,
      });

      showSnackbar({
        message:
          "You've successfully registered on our website. To complete the registration process, please check your email 📬",
      });
      resetForm();
      onSuccess?.();
    } catch {
      showSnackbar({
        message: 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    termsAccepted,
    setTermsAccepted,
    showPassword,
    setShowPassword,
    loading,
    emailValid,
    passwordValid,
    canSubmit,
    handleSubmit,
  };
}
