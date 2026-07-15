import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './theme';
import App from './App';
import { SnackbarProvider } from './components/common/Snackbar';
import { AuthModalsProvider } from './components/context/AuthModalContext';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <CssBaseline />
          <AuthModalsProvider>
            <App />
          </AuthModalsProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
