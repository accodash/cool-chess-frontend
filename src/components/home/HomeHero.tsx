import { useAuth0 } from '@auth0/auth0-react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function HomeHero() {
    const { loginWithRedirect } = useAuth0();
    const { data: currentUser } = useCurrentUser();

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
            {!!currentUser && (
                <Button
                    aria-label='Start playing'
                    variant='contained'
                    color='secondary'
                    size='large'
                    component={Link}
                    to='/play'
                >
                    Start playing
                </Button>
            )}
            {!currentUser && (
                <Button
                    aria-label='Join us'
                    variant='contained'
                    color='secondary'
                    size='large'
                    onClick={() => loginWithRedirect()}
                >
                    Join us
                </Button>
            )}
        </Box>
    );
};
