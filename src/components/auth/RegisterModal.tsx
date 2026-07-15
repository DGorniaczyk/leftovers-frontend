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
import { useRegisterModal } from './useRegisterModal';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../constants/validation';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterModal({ open, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { register, errors, showPassword, setShowPassword, isSubmitting, canSubmit, handleSubmit } =
    useRegisterModal({ open, onSuccess: onClose });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: 1, padding: 2.5, width: '100%', maxWidth: 420 } } }}
    >
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
        <Typography variant="h4" sx={{ font: 'Poppins', fontWeight: 600 }}>
          Sign up
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Create an account for free
        </Typography>

        {/* ── Email ── */}
        <TextField
          label="E-mail address*"
          placeholder="Enter your email"
          type="email"
          fullWidth
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('email', {
            required: 'E-mail address is required.',
            pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email.' },
          })}
        />

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
            pattern: {
              value: PASSWORD_PATTERN,
              message:
                'Use at least 8 characters, including uppercase, lowercase, a number, and a symbol.',
            },
          })}
        />

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mt: 1 }}>
          <Checkbox
            aria-label="Accept terms and conditions"
            {...register('terms', { required: true })}
            size="small"
            sx={{ p: 0, mt: '1px' }}
          />
          <Typography variant="body2">
            Acceptance of{' '}
            <Link
              href="/tos"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'text.primary', fontWeight: 'bold' }}
            >
              Terms & conditions
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'text.primary', fontWeight: 'bold' }}
            >
              Privacy Policy
            </Link>
          </Typography>
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={!canSubmit}
          sx={{ mt: 1, height: 44, width: 220 }}
        >
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Create an account'}
        </Button>

        <Typography variant="body2" sx={{ mt: 1, textAlign: 'left' }}>
          Already have an account?{' '}
          <Link
            component="button"
            type="button"
            underline="always"
            onClick={onSwitchToLogin}
            sx={{
              verticalAlign: 'baseline',
              cursor: 'pointer',
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Login
          </Link>
        </Typography>
      </Box>
    </Dialog>
  );
}
