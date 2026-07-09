import { Outlet } from 'react-router';
import Box from '@mui/material/Box';
import Taskbar from '../components/navigation/Taskbar';
import Footer from '../components/navigation/Footer';

export default function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Taskbar />

      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}
