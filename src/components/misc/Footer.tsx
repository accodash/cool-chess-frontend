import { Box, Typography, Link, IconButton, Stack } from '@mui/material';
import { GitHub, Twitter, Instagram } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#121212',
        color: 'white',
        py: 4,
        px: 4,
        mt: 'auto',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="body2" color="gray">
          © {new Date().getFullYear()} Cool Chess. All rights reserved.
        </Typography>

        <Stack direction="row" spacing={1}>
          <IconButton
            component={Link}
            href="https://github.com/accodash/cool-chess-frontend"
            target="_blank"
            rel="noopener"
            color="inherit"
          >
            <GitHub />
          </IconButton>
          <IconButton
            component={Link}
            href="https://twitter.com/"
            target="_blank"
            rel="noopener"
            color="inherit"
          >
            <Twitter />
          </IconButton>
          <IconButton
            component={Link}
            href="https://instagram.com/"
            target="_blank"
            rel="noopener"
            color="inherit"
          >
            <Instagram />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
