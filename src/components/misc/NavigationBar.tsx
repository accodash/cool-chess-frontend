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
} from '@mui/material';
import { SportsEsports, Article, EmojiPeople, MilitaryTech, Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const menuItems = [
    { icon: <SportsEsports />, label: 'Play', link: '/play' },
    { icon: <Article />, label: 'History', link: '/history' },
    { icon: <MilitaryTech />, label: 'Ranking', link: '/ranking' },
    { icon: <EmojiPeople />, label: 'Social', link: '/social/friends' },
];

interface NavigationBarProps {
    onLogin: () => void;
    onLogout: () => void;
}

function NavigationBar({ onLogin, onLogout }: NavigationBarProps) {
    const { data: currentUser } = useCurrentUser();

    return (
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
                                to={item.link}
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
                            <Button fullWidth variant="outlined" onClick={onLogout}>
                                Sign Out
                            </Button>
                        </>
                    )}
                    {!currentUser && (
                        <Button fullWidth variant="contained" onClick={onLogin}>
                            Log In
                        </Button>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
}

export default NavigationBar;
