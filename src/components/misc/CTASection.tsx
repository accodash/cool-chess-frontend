import { Box, Typography, Button } from '@mui/material';

interface CTASectionProps {
    onLogin: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onLogin }) => {
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
                onClick={onLogin}
            >
                Sign in
            </Button>
        </Box>
    );
};

export default CTASection;
