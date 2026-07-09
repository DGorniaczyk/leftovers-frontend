import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import InstagramSvg from '../../assets/Instagram.svg';
import FacebookSvg from '../../assets/Facebook.svg';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid #e0e0e0',
        px: { xs: 2, md: 4 },
        py: 1.5,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 1.5, md: 0 },
        backgroundColor: '#fff',
      }}
    >
      {/* ── Left side ── */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        {/* Social icons — navigate to real sites */}
        <IconButton
          size="small"
          aria-label="Instagram"
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ p: 0.5 }}
        >
          <img src={InstagramSvg} alt="Instagram" style={{ width: 20, height: 20 }} />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Facebook"
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ p: 0.5 }}
        >
          <img src={FacebookSvg} alt="Facebook" style={{ width: 20, height: 20 }} />
        </IconButton>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }}
        />

        {/* Contact email — visible, no navigation */}
        <Typography variant="body2" color="text.secondary">
          contact@leftovers.com
        </Typography>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }}
        />

        {/* Terms — visible, no navigation */}
        <Link
          component="span"
          variant="body2"
          color="text.secondary"
          sx={{ cursor: 'default', '&:hover': { textDecoration: 'none' } }}
        >
          Terms of Services
        </Link>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }}
        />

        {/* Privacy — visible, no navigation */}
        <Link
          component="span"
          variant="body2"
          color="text.secondary"
          sx={{ cursor: 'default', '&:hover': { textDecoration: 'none' } }}
        >
          Privacy Policy
        </Link>
      </Box>

      {/* ── Right side ── */}
        <Typography variant="body2" color="text.secondary">
        powered by{' '}
        <Link
          href="https://botai.com"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ fontWeight: 500, color: 'text.secondary' }}
        >
          BotAI
        </Link>
      </Typography>
    </Box>
  );
}
