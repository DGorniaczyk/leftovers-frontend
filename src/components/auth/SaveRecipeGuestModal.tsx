import { Box, Button, Dialog, Typography } from '@mui/material';
import { useAuthModals } from '../context/AuthModalContext';

interface SaveRecipeModalProps {
  open: boolean;
  onClose: () => void;
}

export function SaveRecipeModal({ open, onClose }: SaveRecipeModalProps) {
  const { openLogin } = useAuthModals();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            p: 2.5,
            width: '100%',
            maxWidth: 480,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {' '}
        <Typography variant="h6" fontWeight={600}>
          {' '}
          Login to save the recipe
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {' '}
          If you want to save this recipe you need to login or create an account. Don't miss out on
          the convenience of having your favorite recipes at your fingertips whenever you crave
          them!
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 1,
              minWidth: 80,
              height: 36,
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
              minWidth: 80,
              height: 36,
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
