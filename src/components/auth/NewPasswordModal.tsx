import {
  Box,
  Dialog,
  DialogContent,
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
import { useNewPasswordModal } from './useNewPasswordModal';

interface NewPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewPasswordModal({ open, onClose }: NewPasswordModalProps) {
  const {
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
  } = useNewPasswordModal({ onClose });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 1,
            padding: 2.5,
            width: '100%',
            maxWidth: 440,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h5" fontWeight={500} height={32} width={452}>
              New password
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={400}>
              Please ensure your password is a minimum of 8 characters long. Ideally, include a mix
              of both letters and numbers.
            </Typography>
          </Box>

          <TextField
            label="New password*"
            placeholder="Type new password"
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
              onChange: () => trigger('confirmPassword'),
            })}
          />

          <TextField
            label="Repeat new password*"
            placeholder="Type new password again"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            {...register('confirmPassword', {
              required: 'Please confirm your password.',
              validate: (value) => value === getValues('password') || 'Passwords do not match.',
            })}
          />

          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              justifyContent: 'flex-end',
            }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={handleClose}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 1,
                width: 83,
                height: 32,
                px: 3,
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || loading || !token}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 1,
                width: 173,
                height: 32,
                px: 3,
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Reset my password'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
