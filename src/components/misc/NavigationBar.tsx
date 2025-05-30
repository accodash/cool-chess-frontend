import { useState } from 'react';
import {
  Avatar,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Icon,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { Menu, SportsEsports, Article, EmojiPeople, MilitaryTech, Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useAuth0 } from '@auth0/auth0-react';

const menuItems = [
  { icon: <SportsEsports />, label: 'Play', link: '/play', publicLink: '/play' },
  { icon: <Article />, label: 'History', link: '/history', publicLink: '/history' },
  { icon: <MilitaryTech />, label: 'Ranking', link: '/ranking', publicLink: '/ranking' },
  { icon: <EmojiPeople />, label: 'Social', link: '/social/friends', publicLink: '/social/all-users' },
];

function NavigationBar() {
  const { loginWithRedirect, logout } = useAuth0();
  const { data: currentUser } = useCurrentUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerContent = (
    <Box display="flex" flexDirection="column" height="100%" width="100%" alignItems="stretch">
      <List sx={{ flex: 1 }}>
        <ListItemButton component={Link} to="/">
          <ListItemText
            primary={
              <Typography variant="h5" align="center">
                Cool Chess
              </Typography>
            }
          />
        </ListItemButton>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ justifyContent: 'center', width: '100%' }}>
            <ListItemButton
              sx={{ flexDirection: 'column', padding: '12px 0' }}
              component={Link}
              to={!!currentUser ? item.link : item.publicLink}
            >
              <ListItemIcon sx={{ minWidth: 'unset', pt: 1 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={<Typography variant="caption">{item.label}</Typography>} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box width="100%" px={1} py={1}>
        {currentUser && (
          <>
            <Button
              fullWidth
              component={Link}
              to={`/social/user/${currentUser.uuid}`}
              sx={{
                mb: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                textTransform: 'none',
              }}
            >
              {currentUser.imageUrl ? (
                <Avatar src={currentUser.imageUrl} sx={{ width: 40, height: 40 }} />
              ) : (
                <Icon>
                  <Person />
                </Icon>
              )}
              <Typography variant="caption" align="center">
                {currentUser.username}
              </Typography>
            </Button>
            <Button fullWidth variant="outlined" onClick={() => logout()}>
              Sign Out
            </Button>
          </>
        )}
        {!currentUser && (
          <Button fullWidth variant="contained" onClick={() => loginWithRedirect()}>
            Log In
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ position: 'fixed', top: 8, left: 8, zIndex: 5 }}
          >
            <Menu />
          </IconButton>
          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: 240,
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: 120,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 120,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}

export default NavigationBar;
