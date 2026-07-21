import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import StarIcon from '@mui/icons-material/Star';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import type { Recipe } from './types';

interface RecipeCardProps {
  recipe: Recipe;
  saved: boolean;
  loading: boolean;
  onOpen: () => void;
  onToggleSaved: () => void;
}

export function RecipeCard({ recipe, saved, loading, onOpen, onToggleSaved }: RecipeCardProps) {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.12)' },
      }}
    >
      {/* ── Image ── */}
      <Box sx={{ position: 'relative' }} onClick={onOpen}>
        <Box
          component="img"
          src={recipe.coverImageUrl}
          alt={recipe.title}
          sx={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
        />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggleSaved();
          }}
          disabled={loading}
          aria-label={saved ? 'Unsave recipe' : 'Save recipe'}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'white',
            width: 34,
            height: 34,
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            '&:hover': { bgcolor: 'white' },
          }}
        >
          {loading ? (
            <CircularProgress size={14} />
          ) : saved ? (
            <BookmarkOutlinedIcon sx={{ fontSize: 17 }} />
          ) : (
            <BookmarkBorderOutlinedIcon sx={{ fontSize: 17 }} />
          )}
        </IconButton>
      </Box>

      {/* ── Content ── */}
      <Box
        onClick={onOpen}
        sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 0.75, flexGrow: 1 }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {recipe.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
            flexGrow: 1,
          }}
        >
          {recipe.description}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <Typography variant="body2" fontWeight={600}>
            {recipe.averageRating?.toFixed(1) ?? '—'}
          </Typography>
          <StarIcon sx={{ fontSize: 15, color: '#FFC107' }} />
          <Typography variant="body2" color="text.secondary">
            ({recipe.ratingsCount ?? 0})
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
