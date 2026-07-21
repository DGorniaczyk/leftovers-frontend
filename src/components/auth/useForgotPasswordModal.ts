import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../common/Snackbar';
import { resetPassword } from '../../api/auth/resetPasswordService';
import { EMAIL_PATTERN } from '../constants/validation';

export interface ForgotPasswordFormValues {
  email: string;
}

interface UseForgotPasswordModalProps {
  open: boolean;
  onSuccess?: () => void;
}

export function useForgotPasswordModal({ open, onSuccess }: UseForgotPasswordModalProps) {
  const showSnackbar = useSnackbar();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!open) {
      reset();
      setLoading(false);
    }
  }, [open, reset]);

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setLoading(true);
      const message = await resetPassword({ email: data.email });
      showSnackbar({ message });
      reset();
      onSuccess?.();
    } catch {
      showSnackbar({ message: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    errors,
    loading,
    canSubmit: isValid && !loading,
    handleSubmit: handleSubmit(onSubmit),
    EMAIL_PATTERN,
  };
}
