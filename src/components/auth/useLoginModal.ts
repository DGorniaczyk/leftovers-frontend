import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../common/Snackbar';
import { loginUser } from '../../api/auth/loginService';

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface UseLoginModalProps {
  open: boolean;
  onSuccess?: () => void;
}

export function useLoginModal({ open, onSuccess }: UseLoginModalProps) {
  const showSnackbar = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '', rememberMe: false },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!open) {
      reset();
      setShowPassword(false);
      setLoading(false);
    }
  }, [open, reset]);

  const canSubmit = isValid && !loading;

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      await loginUser({ email: data.email, password: data.password, rememberMe: data.rememberMe });
      showSnackbar({ message: 'Welcome back! You are now logged in.' });
      reset();
      onSuccess?.();
    } catch {
      showSnackbar({ message: 'Login failed. Please check your credentials and try again.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    errors,
    showPassword,
    setShowPassword,
    loading,
    canSubmit,
    handleSubmit: handleSubmit(onSubmit),
  };
}
