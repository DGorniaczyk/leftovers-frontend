import { Button, Typography, Box } from '@mui/material';
import { useSearchParams } from 'react-router';
import { NewPasswordModal } from '../components/auth/NewPasswordModal';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const isResetPasswordOpen = searchParams.get('modal') === 'reset-password';

  const handleClose = () => {
    searchParams.delete('modal');
    searchParams.delete('token');
    setSearchParams(searchParams);
  };

  return (
    <>
      <Box sx={{ p: 4 }}>
        <Typography variant="h1">Welcome</Typography>

        <Button variant="contained">Click me</Button>
      </Box>

      <NewPasswordModal open={isResetPasswordOpen} onClose={handleClose} />
    </>
  );
}
