import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../../assets/logo.svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { fetchCategories, type CategoryOption } from '../../api/categories';
import { isAuthenticated, subscribe, removeToken } from '../../api/auth/authService';
import { useNavigate } from 'react-router';
import { useAuthModals } from '../context/AuthModalContext';

const BRAND_GREEN = '#2e7d32';

const SearchWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 6,
  backgroundColor: '#fff',
  overflow: 'hidden',
  flexGrow: 1,
  maxWidth: 560,
  '&:focus-within': {
    borderColor: BRAND_GREEN,
    boxShadow: `0 0 0 2px ${BRAND_GREEN}22`,
  },
  transition: 'box-shadow 0.2s, border-color 0.2s',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flexGrow: 1,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1.5),
    fontSize: 14,
  },
}));

const SearchIconBtn = styled(IconButton)(() => ({
  color: '#fff',
  backgroundColor: BRAND_GREEN,
  borderRadius: 0,
  padding: '8px 12px',
  '&:hover': { backgroundColor: '#1b5e20' },
}));

export default function Taskbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { openRegister, openLogin } = useAuthModals();

  const [recipesAnchor, setRecipesAnchor] = useState<null | HTMLElement>(null);
  const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    const unsubscribe = subscribe(() => setIsLoggedIn(isAuthenticated()));

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'jwt') {
        setIsLoggedIn(Boolean(e.newValue));
      }
    };

    window.addEventListener('storage', onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    void fetchCategories().then(setCategories);
  }, []);

  const handleRecipesOpen = (e: React.MouseEvent<HTMLElement>) => setRecipesAnchor(e.currentTarget);
  const handleRecipesClose = () => setRecipesAnchor(null);
  const handleAccountOpen = (e: React.MouseEvent<HTMLElement>) => setAccountAnchor(e.currentTarget);
  const handleAccountClose = () => setAccountAnchor(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    handleAccountClose();
    navigate('/');
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ gap: 2, px: { xs: 2, md: 4 }, minHeight: { xs: 60, md: 68 } }}>
          {/* ── Logo ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mr: 1 }}>
            <img src={logo} alt="Logo" style={{ height: 40 }} />
          </Box>

          {/* ── Search bar (hidden on mobile, shown in drawer instead) ── */}
          {!isMobile && (
            <SearchWrapper>
              <StyledInputBase
                placeholder="Search recipes…"
                inputProps={{ 'aria-label': 'search recipes' }}
              />

              <SearchIconBtn disableRipple aria-label="search">
                <SearchIcon fontSize="small" />
              </SearchIconBtn>
            </SearchWrapper>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* ── Desktop nav ── */}
          {!isMobile ? (
            <>
              {/* Add recipe when logged in */}
              {isLoggedIn && (
                <Button
                  sx={{
                    color: BRAND_GREEN,
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: 15,
                    mr: 1,
                  }}
                  startIcon={<svg width="0" height="0" />}
                >
                  + Add recipe
                </Button>
              )}

              {/* Recipes dropdown */}
              <Button
                endIcon={recipesAnchor ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                onClick={handleRecipesOpen}
                sx={{ color: 'text.primary', fontWeight: 500, textTransform: 'none', fontSize: 15 }}
              >
                Recipes
              </Button>
              <Menu
                anchorEl={recipesAnchor}
                open={Boolean(recipesAnchor)}
                onClose={handleRecipesClose}
                slotProps={{ paper: { sx: { mt: 1, minWidth: 180 } } }}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.value}
                    onClick={handleRecipesClose}
                    sx={(theme) => ({
                      fontSize: 14,
                      borderTop:
                        category.value !== 'all' ? `1px solid ${theme.palette.divider}` : 'none',
                    })}
                  >
                    {category.label}
                  </MenuItem>
                ))}
              </Menu>

              {/* Logged-out actions */}
              {!isLoggedIn && (
                <>
                  <Button
                    onClick={() => openLogin()}
                    sx={{
                      color: BRAND_GREEN,
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: 15,
                    }}
                  >
                    Log in
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => openRegister()}
                    sx={{
                      backgroundColor: BRAND_GREEN,
                      color: '#fff',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: 15,
                      borderRadius: 1,
                      px: 2.5,
                      '&:hover': { backgroundColor: '#1b5e20' },
                    }}
                  >
                    Sign up
                  </Button>
                </>
              )}

              {/* My account when logged in */}
              {isLoggedIn && (
                <>
                  <Button
                    variant="contained"
                    endIcon={accountAnchor ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    onClick={handleAccountOpen}
                    sx={{
                      backgroundColor: BRAND_GREEN,
                      color: '#fff',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: 15,
                      borderRadius: 1,
                      px: 2.5,
                      '&:hover': { backgroundColor: '#1b5e20' },
                    }}
                  >
                    My account
                  </Button>

                  <Menu
                    anchorEl={accountAnchor}
                    open={Boolean(accountAnchor)}
                    onClose={handleAccountClose}
                    slotProps={{ paper: { sx: { mt: 1, minWidth: 200 } } }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleAccountClose();
                        navigate('/saved');
                      }}
                    >
                      Saved recipes
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleAccountClose();
                        navigate('/my-recipes');
                      }}
                    >
                      My recipes
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                  </Menu>
                </>
              )}
            </>
          ) : (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'text.primary' }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>

        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 280, pt: 2 }}>
            {/* Close */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pb: 1 }}>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Mobile search */}
            <Box sx={{ px: 2, pb: 2 }}>
              <SearchWrapper sx={{ maxWidth: '100%' }}>
                <StyledInputBase
                  placeholder="Search recipes…"
                  inputProps={{ 'aria-label': 'search recipes' }}
                  fullWidth
                />
                <SearchIconBtn disableRipple>
                  <SearchIcon fontSize="small" />
                </SearchIconBtn>
              </SearchWrapper>
            </Box>

            <Divider />

            {/* Recipes links */}
            <List dense>
              <ListItem disablePadding>
                <ListItemText
                  primary="Recipes"
                  sx={{
                    px: 2,
                    pt: 1,
                    '& span': { fontWeight: 700, fontSize: 13, color: 'text.secondary' },
                  }}
                />
              </ListItem>
              {categories.map((category) => (
                <ListItem key={category.value} disablePadding>
                  <ListItemButton
                    onClick={() => setDrawerOpen(false)}
                    sx={(theme) => ({
                      borderTop:
                        category.value !== 'all' ? `1px solid ${theme.palette.divider}` : 'none',
                    })}
                  >
                    <ListItemText
                      primary={category.label}
                      sx={{ '& .MuiListItemText-primary': { fontSize: 15 } }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Divider />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, pt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => openLogin()}
                sx={{
                  color: BRAND_GREEN,
                  borderColor: BRAND_GREEN,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: 15,
                }}
              >
                Log in
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => openRegister()}
                sx={{
                  backgroundColor: BRAND_GREEN,
                  color: '#fff',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: 15,
                  '&:hover': { backgroundColor: '#1b5e20' },
                }}
              >
                Sign up
              </Button>
            </Box>
          </Box>
        </Drawer>
      </AppBar>
    </>
  );
}
