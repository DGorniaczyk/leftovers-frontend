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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useRegisterModal } from './useRegisterModal';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

export function RegisterModal({ open, onClose }: RegisterModalProps) {
  const {
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
  } = useRegisterModal({ open, onSuccess: onClose });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: 1, padding: 2.5, width: '100%', maxWidth: 420 } } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" sx={{ font: 'Poppins', fontWeight: 600 }}>
          Sign up
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Create an account for free
        </Typography>

        <TextField
          label="E-mail address*"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={!emailValid && email.length > 0}
          fullWidth
          slotProps={{
            inputLabel: { shrink: true },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'secondary',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary',
              },
            },
          }}
        />
        {!emailValid && email.length > 0 && (
          <Typography sx={{ fontSize: 12, color: 'error.main' }}>Enter a valid email</Typography>
        )}

        <TextField
          label="Password*"
          placeholder="Create a password"
          value={password}
          type={showPassword ? 'text' : 'password'}
          onChange={(event) => setPassword(event.target.value)}
          fullWidth
          error={password.length > 0 && !passwordValid}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'secondary',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary',
              },
            },
          }}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {' '}
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((previous) => !previous)}
                    edge="end"
                  >
                    {' '}
                    {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}{' '}
                  </IconButton>{' '}
                </InputAdornment>
              ),
            },
          }}
        />
        {password.length > 0 && !passwordValid && (
          <Typography sx={{ fontSize: 12, color: 'error.main' }}>
            Use at least 8 characters, including uppercase, lowercase, a number, and a symbol
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, justifyContent: 'left' }}>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            style={{ marginTop: 4 }}
          />

          <Typography variant="body2">
            {' '}
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
            </Link>{' '}
          </Typography>
        </Box>

        <Button
          variant="contained"
          disabled={!canSubmit}
          onClick={handleSubmit}
          sx={{ mt: 1, height: 44, width: 220 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Create an account'}
        </Button>

        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link
            href="/login"
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
            }}
            underline="always"
          >
            Login
          </Link>
        </Typography>
      </Box>
    </Dialog>
  );
}
