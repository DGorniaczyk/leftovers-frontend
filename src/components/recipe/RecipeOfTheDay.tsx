import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import { useRecipeOfTheDayCard } from './useRecipeOfTheDay';

function RecipeOfTheDaySkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
    >
      <Skeleton variant="rectangular" width={480} sx={{ flexShrink: 0 }} />
      <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Skeleton width={140} height={18} />
        <Skeleton width={80} height={18} />
        <Skeleton width="85%" height={40} />
        <Skeleton width="100%" height={52} />
        <Skeleton width={260} height={16} sx={{ mt: 1 }} />
        <Skeleton width={120} height={20} sx={{ mt: 1 }} />
      </Box>
    </Box>
  );
}

export function RecipeOfTheDay() {
  const { recipe, loading, saved, savingLoading, toggleSaved, openRecipe } =
    useRecipeOfTheDayCard();

  if (loading) return <RecipeOfTheDaySkeleton />;
  if (!recipe) return null;

  const hasRating = recipe.averageRating !== null && recipe.ratingsCount > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'white',
        boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
      }}
    >
      {/* ── Image ── */}
      <Box sx={{ position: 'relative', flexShrink: 0, width: { xs: '100%', md: 480 } }}>
        <Box
          component="img"
          src={recipe.coverImageUrl}
          alt={recipe.title}
          sx={{
            width: '100%',
            height: { xs: 260, md: '100%' },
            minHeight: { md: 300 },
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <IconButton
          onClick={toggleSaved}
          disabled={savingLoading}
          aria-label={saved ? 'Unsave recipe' : 'Save recipe'}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            width: 36,
            height: 36,
            '&:hover': { bgcolor: 'white' },
          }}
        >
          {savingLoading ? (
            <CircularProgress size={16} />
          ) : saved ? (
            <BookmarkOutlinedIcon sx={{ fontSize: 18 }} />
          ) : (
            <BookmarkBorderOutlinedIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Box>

      {/* ── Content ── */}
      <Box
        sx={{ flex: 1, p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 1.5 }}
      >
        <Typography
          variant="overline"
          sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, lineHeight: 1 }}
        >
          Recipe of the Day
        </Typography>

        {/* Rating */}
        {hasRating && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" fontWeight={600}>
              {recipe.averageRating!.toFixed(1)}
            </Typography>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                sx={{
                  fontSize: 16,
                  color: star <= Math.round(recipe.averageRating!) ? '#FFC107' : '#E0E0E0',
                }}
              />
            ))}
            <Typography variant="body2" color="text.secondary">
              ({recipe.ratingsCount})
            </Typography>
          </Box>
        )}

        <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.3 }}>
          {recipe.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.7,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {recipe.description}
        </Typography>

        {/* Meta */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            sx={{ letterSpacing: 0.8, textTransform: 'uppercase' }}
          >
            Preparation time: {recipe.prepTimeMinutes} minutes
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            sx={{ letterSpacing: 0.8, textTransform: 'uppercase' }}
          >
            {recipe.servings} servings
          </Typography>
        </Box>

        {/* CTA */}
        <Button
          endIcon={<ChevronRightIcon />}
          onClick={openRecipe}
          disableRipple
          sx={{
            color: 'primary.main',
            fontWeight: 600,
            fontSize: 14,
            alignSelf: 'flex-start',
            p: 0,
            mt: 0.5,
            textTransform: 'none',
            '&:hover': { bgcolor: 'transparent', opacity: 0.75 },
          }}
        >
          View the recipe
        </Button>
      </Box>
    </Box>
  );
}
