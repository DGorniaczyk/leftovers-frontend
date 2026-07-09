import { Typography, Paper, Snackbar } from '@mui/material';
import React, { createContext, useContext, useState } from 'react';

type SnackbarState = {
  message: string;
};

const SnackbarContext = createContext<(state: SnackbarState) => void>(() => {});

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  return (
    <SnackbarContext.Provider value={setSnackbar}>
      {children}
      {snackbar && (
        <Snackbar
          open={!!snackbar}
          autoHideDuration={5000}
          onClose={() => setSnackbar(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Paper
            elevation={4}
            sx={{
              width: 'fit-content',
              maxWidth: '90vw',
              borderRadius: 1,
              px: 3,
              py: 2,
              color: 'text.primary',
            }}
          >
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
              {snackbar.message}
            </Typography>
          </Paper>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
