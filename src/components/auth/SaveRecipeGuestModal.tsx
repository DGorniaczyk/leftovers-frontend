import { Box, Button, Dialog, Typography } from '@mui/material';
import { useAuthModals } from '../context/AuthModalContext';

interface SaveRecipeModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function SaveRecipeModal({ open, onClose }: SaveRecipeModalProps) {
  const { openLogin } = useAuthModals();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 1,
            p: 3.5,
            width: '100%',
            maxWidth: 750,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" fontWeight={600}>
          Login to save the recipe
        </Typography>

        <Typography variant="body1" color="text.secondary">
          If you want to save this recipe you need to login or create an account. Don't miss out on
          the convenience of having your favorite recipes at your fingertips whenever you crave
          them!
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 1,
              minWidth: 92,
              height: 40,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              onClose();
              openLogin();
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 1,
              minWidth: 92,
              height: 40,
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
