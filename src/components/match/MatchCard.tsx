import { Paper, Typography, Box, Stack, Chip } from '@mui/material';
import { FlashOn, Speed, RocketLaunch, SentimentVerySatisfied, EmojiEvents } from '@mui/icons-material';
import { Match } from '../../api/match';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

interface MatchCardProps {
    match: Match;
}

const MODES = [
    { value: 'bullet', label: 'Bullet', icon: <FlashOn fontSize="small" /> },
    { value: 'blitz', label: 'Blitz', icon: <Speed fontSize="small" /> },
    { value: 'rapid', label: 'Rapid', icon: <RocketLaunch fontSize="small" /> },
];

export default function MatchCard({ match }: MatchCardProps) {
    const { user } = useAuth0();

    const isCurrentUserWhite = match.whitePlayer.uuid === user?.sub;
    const opponent = isCurrentUserWhite ? match.blackPlayer : match.whitePlayer;
    const you = isCurrentUserWhite ? match.whitePlayer : match.blackPlayer;

    const result = match.isCompleted
        ? !match.winner
            ? 'DRAW'
            : match.winner.uuid === user?.sub
              ? 'WON'
              : 'LOST'
        : 'ONGOING';

    const resultColor =
        result === 'WON' ? 'success' : result === 'LOST' ? 'error' : result === 'DRAW' ? 'info' : 'warning';

    const formattedDate = new Date(match.startAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const mode = MODES.find((m) => m.value === match.mode);

    return (
        <Paper
            component={Link}
            to={`/history/${match.id}`}
            elevation={3}
            sx={{ p: 2, borderRadius: 2, textDecoration: 'none' }}
        >
            <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                    {formattedDate}
                </Typography>

                <Typography variant="h6">
                    {you.username} vs {opponent.username}
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip icon={mode?.icon} label={mode?.label ?? match.mode} />
                    <Chip
                        icon={
                            match.isRanked ? (
                                <EmojiEvents fontSize="small" />
                            ) : (
                                <SentimentVerySatisfied fontSize="small" />
                            )
                        }
                        label={match.isRanked ? 'Ranked' : 'Unranked'}
                        color="primary"
                    />
                    <Chip label={result} color={resultColor as any} />
                </Box>
            </Stack>
        </Paper>
    );
}
