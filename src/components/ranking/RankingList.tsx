import { Stack, Paper, Avatar, Typography, Box } from '@mui/material';
import { Person } from '@mui/icons-material';
import { Rating } from '../../api/ratings';

interface RankingListProps {
    entries: Rating[];
    offset: number;
}

export default function RankingList({ entries, offset }: RankingListProps) {
    return (
        <Stack spacing={2}>
            {entries.map((entry, index) => (
                <Paper
                    key={entry.id}
                    elevation={3}
                    sx={{ p: 2, display: 'flex', alignItems: 'center' }}
                >
                    <Typography variant='h6' sx={{ width: 40 }}>
                        #{offset + index + 1}
                    </Typography>
                    <Avatar
                        sx={{ width: 48, height: 48, mx: 2 }}
                        src={entry.user?.imageUrl || undefined}
                    >
                        {!entry.user?.imageUrl && <Person />}
                    </Avatar>
                    <Box>
                        <Typography variant='subtitle1'>
                            {entry.user?.username}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            Elo: {entry.rating}
                        </Typography>
                    </Box>
                </Paper>
            ))}
        </Stack>
    );
}
