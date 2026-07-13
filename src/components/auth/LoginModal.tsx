import {
  Box,
  Link,
  Dialog,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useLoginModal } from './useLoginModal';
import { EMAIL_PATTERN } from '../constants/validation';
import { useAuthModals } from '../context/AuthModalContext';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginModal({ open, onClose, onSwitchToRegister }: LoginModalProps) {
  const { register, errors, showPassword, setShowPassword, loading, canSubmit, handleSubmit } =
    useLoginModal({ open, onSuccess: onClose });
  const { openForgotPassword } = useAuthModals();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: 1, padding: 2.5, width: '100%', maxWidth: 420 } } }}
    >
      {/* ── Close ── */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Log in
        </Typography>

        {/* ── Email ── */}
        <TextField
          label="E-mail address*"
          placeholder="Enter your e-mail"
          type="email"
          fullWidth
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('email', {
            required: 'E-mail address is required.',
            pattern: { value: EMAIL_PATTERN, message: 'Enter a valid e-mail address.' },
          })}
        />

        {/* ── Password + forgot ── */}
        <Box>
          <TextField
            label="Password*"
            placeholder="Create a password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            {...register('password', {
              required: 'Password is required.',
            })}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
            <Link
              component="button"
              type="button"
              variant="body2"
              color="text.secondary"
              underline="hover"
              onClick={() => {
                onClose();
                openForgotPassword();
              }}
              sx={{ cursor: 'pointer', background: 'none', border: 'none' }}
            >
              Forgot your password?
            </Link>
          </Box>
        </Box>

        {/* ── Submit ── */}
        <Button
          type="submit"
          variant="contained"
          disabled={!canSubmit}
          sx={{ height: 32, width: 74, textTransform: 'none', fontWeight: 600, borderRadius: 1 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Log in'}
        </Button>

        {/* ── Remember me ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Checkbox {...register('rememberMe')} size="small" sx={{ p: 0, flexShrink: 0 }} />
          <Typography variant="body2">Remember me</Typography>
        </Box>

        {/* ── Switch to register ── */}
        <Typography variant="body2">
          Don't have an account yet?{' '}
          <Link
            component="button"
            type="button"
            underline="always"
            onClick={onSwitchToRegister}
            sx={{
              verticalAlign: 'baseline',
              cursor: 'pointer',
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Create an account
          </Link>
        </Typography>
      </Box>
    </Dialog>
  );
}
