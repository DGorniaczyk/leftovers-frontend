import { Button, Typography, Box } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h1">Welcome</Typography>
      <Button variant="contained" color="primary">
        Click me
      </Button>
    </Box>
  );
}
