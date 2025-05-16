import { useAuth0 } from '@auth0/auth0-react';
import { Box, Typography, Button } from '@mui/material';

export default function CTASection() {
    const { loginWithRedirect } = useAuth0();

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
                Ready to make your first move?
            </Typography>
            <Typography variant='body1' sx={{ mb: 3 }}>
                Sign in and start playing competitive chess right now.
            </Typography>
            <Button
                variant='contained'
                color='primary'
                size='large'
                onClick={() => loginWithRedirect()}
            >
                Sign in
            </Button>
        </Box>
    );
};
