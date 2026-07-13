import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../common/Snackbar';
import { registerUser } from '../../api/auth/registerService';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../constants/validation';

export interface RegisterFormValues {
  email: string;
  password: string;
  terms: boolean;
}

interface UseRegisterModalProps {
  open: boolean;
  onSuccess?: () => void;
}

export function useRegisterModal({ open, onSuccess }: UseRegisterModalProps) {
  const showSnackbar = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    defaultValues: { email: '', password: '', terms: false },
    mode: 'onChange',
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = form;

  useEffect(() => {
    if (!open) {
      reset();
      setShowPassword(false);
      setIsSubmitting(false);
    }
  }, [open, reset]);

  const canSubmit = isValid && !isSubmitting;

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      await registerUser({ email: data.email, password: data.password });
      showSnackbar({
        message:
          "You've successfully registered on our website. To complete the registration process, please check your email 📬",
      });
      reset();
      onSuccess?.();
    } catch {
      showSnackbar({ message: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    errors,
    watch,
    showPassword,
    setShowPassword,
    isSubmitting,
    canSubmit,
    handleSubmit: handleSubmit(onSubmit),
    EMAIL_PATTERN,
    PASSWORD_PATTERN,
  };
}
