import { Box, Typography, Button } from '@mui/material';

export default function HomeHero() {
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
            <Button variant='contained' color='secondary' size='large'>
                Start Playing
            </Button>
        </Box>
    );
}
