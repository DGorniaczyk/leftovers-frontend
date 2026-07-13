import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';
import { useSnackbar } from '../common/Snackbar';
import { setNewPassword } from '../../api/auth/resetPasswordService';
import { PASSWORD_PATTERN } from '../constants/validation';
import { useAuthModals } from '../context/AuthModalContext';

export interface NewPasswordFormValues {
  password: string;
  confirmPassword: string;
}

interface UseNewPasswordModalProps {
  onClose: () => void;
}

export function useNewPasswordModal({ onClose }: UseNewPasswordModalProps) {
  const showSnackbar = useSnackbar();
  const { openLogin } = useAuthModals();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') ?? '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    trigger,
    formState: { errors, isValid },
  } = useForm<NewPasswordFormValues>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const handleClose = () => {
    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const onSubmit = async (data: NewPasswordFormValues) => {
    if (loading) return;

    try {
      setLoading(true);
      await setNewPassword({ token, password: data.password });
      showSnackbar({
        message:
          '✅ Password changed successfully! You can now log in using your updated credentials.',
      });
      handleClose();
      openLogin();
    } catch {
      showSnackbar({ message: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    token,
    loading,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    register,
    handleSubmit,
    errors,
    isValid,
    getValues,
    trigger,
    handleClose,
    onSubmit,
    PASSWORD_PATTERN,
  };
}
