import { Avatar, Box, Paper, Typography, Stack } from '@mui/material';
import { Person } from '@mui/icons-material';

interface UserCardProps {
    index: number;
    username: string;
    createdAt: string;
    imageUrl: string | null;
    followersCount: number;
}

export default function UserCard({
    index,
    username,
    createdAt,
    imageUrl,
    followersCount,
}: UserCardProps) {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 2,
            }}
        >
            <Typography
                variant='body2'
                color='text.secondary'
                sx={{ width: 24, textAlign: 'center' }}
            >
                {index}.
            </Typography>

            <Avatar src={imageUrl ?? undefined} sx={{ width: 56, height: 56 }}>
                {!imageUrl && <Person fontSize='large' />}
            </Avatar>

            <Box>
                <Typography variant='h6'>{username}</Typography>

                <Stack direction='row' spacing={2} mt={0.5}>
                    <Typography variant='body2' color='text.secondary'>
                        Joined on{' '}
                        {new Date(createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Typography>

                    <Typography variant='body2' color='text.secondary'>
                        {followersCount} follower
                        {followersCount !== 1 ? 's' : ''}
                    </Typography>
                </Stack>
            </Box>
        </Paper>
    );
}
