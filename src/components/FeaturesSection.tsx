import { Box, Typography, Grid, Paper } from '@mui/material';
import { SportsEsports, People, Leaderboard } from '@mui/icons-material';

const features = [
    {
        icon: <SportsEsports fontSize='large' />,
        title: 'Play Instantly',
        desc: 'Jump into a game with no downloads required.',
    },
    {
        icon: <People fontSize='large' />,
        title: 'Play With Friends',
        desc: 'Invite and play casual or rated matches with your friends.',
    },
    {
        icon: <Leaderboard fontSize='large' />,
        title: 'Track Your Progress',
        desc: 'Elo ratings, leaderboards, and game history.',
    },
];

export default function FeaturesSection() {
    return (
        <Box sx={{ py: 6, px: 4 }}>
            <Typography variant='h4' textAlign='center' mb={4}>
                Why Choose Us?
            </Typography>
            <Grid container spacing={4} justifyContent='center'>
                {features.map((feat, idx) => (
                    <Grid size={{ xs: 12, md: 4 }} key={idx}>
                        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                            {feat.icon}
                            <Typography variant='h6' fontWeight='bold' mt={2}>
                                {feat.title}
                            </Typography>
                            <Typography variant='body1' mt={1}>
                                {feat.desc}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
