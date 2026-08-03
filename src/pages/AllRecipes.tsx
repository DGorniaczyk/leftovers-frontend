import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import TuneIcon from '@mui/icons-material/Tune';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { fetchCategories, type CategoryOption } from '../api/categories';
import { RecipeCardWrapper } from '../components/recipe/RecipeCardWrapper';
import { useAllRecipes } from '../components/recipe/useAllRecipes';
import { useAuth } from '../api/auth/useAuth';

export default function AllRecipesPage() {
  const { isAuthenticated } = useAuth();
  const { recipes, loading, filters, setSort, setSelectedCategories, setSavedInclusion } =
    useAllRecipes();
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);

  useEffect(() => {
    void fetchCategories().then(setCategoryOptions);
  }, []);

  // Menu anchors
  const [anchorFilters, setAnchorFilters] = useState<HTMLElement | null>(null);
  const [anchorRating, setAnchorRating] = useState<HTMLElement | null>(null);
  const [anchorDate, setAnchorDate] = useState<HTMLElement | null>(null);

  const openFilters = (e: React.MouseEvent<HTMLElement>) => setAnchorFilters(e.currentTarget);
  const closeFilters = () => setAnchorFilters(null);

  const openRating = (e: React.MouseEvent<HTMLElement>) => setAnchorRating(e.currentTarget);
  const closeRating = () => setAnchorRating(null);

  const openDate = (e: React.MouseEvent<HTMLElement>) => setAnchorDate(e.currentTarget);
  const closeDate = () => setAnchorDate(null);

  const handleToggleCategory = (value: string) => {
    const current = filters.selectedCategories ?? [];
    const exists = current.includes(value);
    const next = exists ? current.filter((c) => c !== value) : [...current, value];
    setSelectedCategories(next);
  };

  const handleSavedToggle = (type: 'saved' | 'unsaved') => {
    const includeSaved = filters.includeSaved ?? true;
    const includeUnsaved = filters.includeUnsaved ?? true;
    if (type === 'saved') setSavedInclusion(!includeSaved, includeUnsaved);
    else setSavedInclusion(includeSaved, !includeUnsaved);
  };

  return (
    <Box sx={{ bgcolor: '#F5F5F7', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 3 } }}>
        {/* ── Header ── */}
        <Typography variant="h5" sx={{ mb: 2.5, fontWeight: 700 }}>
          All Recipes
        </Typography>

        {/* ── Filter bar ── */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<TuneIcon />}
            onClick={openFilters}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              fontSize: 14,
              borderRadius: 6,
              borderColor: 'divider',
              color: 'text.primary',
              bgcolor: 'white',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'transparent' },
            }}
          >
            Filters
          </Button>

          <Button
            variant="outlined"
            startIcon={<SwapVertIcon />}
            onClick={openRating}
            sx={{ textTransform: 'none', fontWeight: 500, fontSize: 14, borderRadius: 6 }}
          >
            Rating
          </Button>

          <Button
            variant="outlined"
            startIcon={<SwapVertIcon />}
            onClick={openDate}
            sx={{ textTransform: 'none', fontWeight: 500, fontSize: 14, borderRadius: 6 }}
          >
            Date
          </Button>

          {/* Filters menu */}
          <Menu
            anchorEl={anchorFilters}
            open={Boolean(anchorFilters)}
            onClose={closeFilters}
            PaperProps={{ sx: { width: 240 } }}
            MenuListProps={{ sx: { maxHeight: 360 } }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <List sx={{ width: 240, py: 0 }}>
              <ListItem>
                <ListItemText primary="Dish type" />
              </ListItem>
              {categoryOptions
                .filter((c) => c.value !== 'all')
                .map((opt) => (
                  <ListItem key={opt.value} disablePadding>
                    <ListItemButton
                      sx={{ py: 0.5 }}
                      onClick={() => handleToggleCategory(opt.value)}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox
                          edge="start"
                          checked={(filters.selectedCategories ?? []).includes(opt.value)}
                          size="small"
                        />
                      </ListItemIcon>
                      <ListItemText primary={opt.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              <Divider />
              <ListItem>
                <ListItemText primary="Saved" />
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton sx={{ py: 0.5 }} onClick={() => handleSavedToggle('saved')}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox edge="start" checked={filters.includeSaved ?? true} size="small" />
                  </ListItemIcon>
                  <ListItemText primary="Saved recipes" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton sx={{ py: 0.5 }} onClick={() => handleSavedToggle('unsaved')}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox edge="start" checked={filters.includeUnsaved ?? true} size="small" />
                  </ListItemIcon>
                  <ListItemText primary="Unsaved recipes" />
                </ListItemButton>
              </ListItem>
            </List>
          </Menu>

          {/* Rating menu */}
          <Menu anchorEl={anchorRating} open={Boolean(anchorRating)} onClose={closeRating}>
            <MenuItem>
              <RadioGroup
                value={filters.sortBy === 'rating' ? filters.sortDirection : 'desc'}
                onChange={(e) => {
                  const dir = e.target.value as 'asc' | 'desc';
                  setSort('rating', dir);
                  closeRating();
                }}
              >
                <FormControlLabel value="desc" control={<Radio />} label="Highest score first" />
                <FormControlLabel value="asc" control={<Radio />} label="Lowest score first" />
              </RadioGroup>
            </MenuItem>
          </Menu>

          {/* Date menu */}
          <Menu anchorEl={anchorDate} open={Boolean(anchorDate)} onClose={closeDate}>
            <MenuItem>
              <RadioGroup
                value={filters.sortBy === 'date' ? filters.sortDirection : 'desc'}
                onChange={(e) => {
                  const dir = e.target.value as 'asc' | 'desc';
                  setSort('date', dir);
                  closeDate();
                }}
              >
                <FormControlLabel value="desc" control={<Radio />} label="Sort by newest" />
                <FormControlLabel value="asc" control={<Radio />} label="Sort by oldest" />
              </RadioGroup>
            </MenuItem>
          </Menu>
        </Box>

        {/* ── Recipe grid ── */}
        <Grid container spacing={2}>
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                </Grid>
              ))
            : recipes.map((recipe) => (
                <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <RecipeCardWrapper recipe={recipe} isAuthenticated={isAuthenticated} />
                </Grid>
              ))}
        </Grid>
      </Box>
    </Box>
  );
}
