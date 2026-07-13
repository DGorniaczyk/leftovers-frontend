import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForgotPasswordModal } from './useForgotPasswordModal';
import { EMAIL_PATTERN } from '../constants/validation';

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const { register, errors, loading, canSubmit, handleSubmit } = useForgotPasswordModal({
    open,
    onSuccess: onClose,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: 1, padding: 2.5, width: '100%', maxWidth: 440 } } }}
    >
      {/* ── Close ── */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h4" fontWeight={600}>
              Forgot password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No worries! Enter your email address below, and we'll send you a link to reset your
              password.
            </Typography>
          </Box>

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

          {/* ── Actions ── */}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 1,
                color: 'primary.main',
                borderColor: 'primary.main',
                height: 44,
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!canSubmit}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 1,
                height: 44,
                px: 3,
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Send e-mail'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
