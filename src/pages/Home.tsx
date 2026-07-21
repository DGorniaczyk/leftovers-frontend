import { Button, Typography, Box, Grid, Skeleton, Divider } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router';
import { NewPasswordModal } from '../components/auth/NewPasswordModal';
import { RecipeCard } from '../components/recipe/RecipeCard';
import { RecipeOfTheDay } from '../components/recipe/RecipeOfTheDay';
import { useRecipeCard } from '../components/recipe/useRecipeCard';
import { useRecipes } from '../components/recipe/useRecipes';
import { useAuth } from '../api/auth/useAuth';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { Recipe } from '../components/recipe/types';

function RecipeCardWrapper({
  recipe,
  isAuthenticated,
}: {
  recipe: Recipe;
  isAuthenticated: boolean;
}) {
  const { saved, loading, toggleSaved, openRecipe } = useRecipeCard({ recipe, isAuthenticated });

  return (
    <RecipeCard
      recipe={recipe}
      saved={saved}
      loading={loading}
      onOpen={openRecipe}
      onToggleSaved={toggleSaved}
    />
  );
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { recipes, loading } = useRecipes();

  const isResetPasswordOpen = searchParams.get('modal') === 'reset-password';

  const handleClose = () => {
    searchParams.delete('modal');
    searchParams.delete('token');
    setSearchParams(searchParams);
  };

  return (
    <>
      <Box sx={{ bgcolor: '#F5F5F7', minHeight: '100vh', py: 4 }}>
        <Box sx={{ maxWidth: 980, mx: 'auto', px: { xs: 2, md: 3 } }}>
          {/* ── Recipe of the Day ── */}
          <Box sx={{ mb: 5 }}>
            <RecipeOfTheDay />
          </Box>

          {/* ── New Recipes ── */}
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              New Recipes
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                    </Grid>
                  ))
                : recipes.slice(0, 8).map((recipe) => (
                    <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 3 }}>
                      <RecipeCardWrapper recipe={recipe} isAuthenticated={isAuthenticated} />
                    </Grid>
                  ))}
            </Grid>

            {/* ── See all recipes ── */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Button
                variant="contained"
                endIcon={<ChevronRightIcon />}
                onClick={() => navigate('/recipes')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 1,
                  px: 4,
                  py: 1.25,
                }}
              >
                See all recipes
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <NewPasswordModal open={isResetPasswordOpen} onClose={handleClose} />
    </>
  );
}
