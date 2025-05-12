import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface HomeHeroProps {
    loggedIn: boolean;
    onLogin: () => void;
}

const HomeHero: React.FC<HomeHeroProps> = ({ loggedIn, onLogin }) => {
    return (
        <Box
            sx={{
                py: 8,
                px: 4,
                textAlign: 'center',
                backgroundColor: 'primary.main',
                color: 'white',
            }}
        >
            <Typography variant='h2' fontWeight='bold' gutterBottom>
                Play Chess Online
            </Typography>
            <Typography variant='h6' sx={{ mb: 4 }}>
                Challenge your friends, join ranked matches, or just have fun!
            </Typography>
            {loggedIn && (
                <Button
                    variant='contained'
                    color='secondary'
                    size='large'
                    component={Link}
                    to='/play'
                >
                    Start playing
                </Button>
            )}
            {!loggedIn && (
                <Button
                    variant='contained'
                    color='secondary'
                    size='large'
                    onClick={onLogin}
                >
                    Join us
                </Button>
            )}
        </Box>
    );
};

export default HomeHero;
