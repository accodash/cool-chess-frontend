import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface CTASectionProps {
    loggedIn: boolean;
    onLogin: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ loggedIn, onLogin }) => {
    return (
        <Box
            sx={{
                textAlign: 'center',
                py: 6,
                backgroundColor: 'secondary.main',
                color: 'white',
            }}
        >
            <Typography variant='h4' gutterBottom>
                {loggedIn
                    ? "We're glad you're playing with us!"
                    : 'Ready to make your first move?'}
            </Typography>
            <Typography variant='body1' sx={{ mb: 3 }}>
                {loggedIn
                    ? "Why don't you play a round or two?"
                    : 'Sign in and start playing competitive chess right now.'}
            </Typography>

            {loggedIn && (
                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    component={Link}
                    to='/play'
                >
                    Let's have a match
                </Button>
            )}
            {!loggedIn && (
                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    onClick={onLogin}
                >
                    Sign in
                </Button>
            )}
        </Box>
    );
};

export default CTASection;
