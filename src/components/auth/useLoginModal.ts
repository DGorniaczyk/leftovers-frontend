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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '', rememberMe: false },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!open) {
      reset();
      setShowPassword(false);
    }
  }, [open, reset]);

  const canSubmit = isValid && !isSubmitting;

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await loginUser({ email: data.email, password: data.password, rememberMe: data.rememberMe });
      showSnackbar({ message: 'Welcome back! You are now logged in.' });
      reset();
      onSuccess?.();
    } catch {
      showSnackbar({ message: 'Login failed. Please check your credentials and try again.' });
    }
  };

  return {
    register,
    errors,
    showPassword,
    setShowPassword,
    loading: isSubmitting,
    canSubmit,
    handleSubmit: handleSubmit(onSubmit),
  };
}
