import { Paper, Typography, Box, Stack, Chip, Button, useMediaQuery, useTheme } from '@mui/material';
import { FlashOn, Speed, RocketLaunch, SentimentVerySatisfied, EmojiEvents } from '@mui/icons-material';
import { Match } from '../../api/match';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface MatchCardProps {
    match: Match;
    isStatic?: boolean;
}

const MODES = [
    { value: 'bullet', label: 'Bullet', icon: <FlashOn fontSize="small" /> },
    { value: 'blitz', label: 'Blitz', icon: <Speed fontSize="small" /> },
    { value: 'rapid', label: 'Rapid', icon: <RocketLaunch fontSize="small" /> },
];

export default function MatchCard({ match, isStatic = false }: MatchCardProps) {
    const { data: currentUser } = useCurrentUser();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const result = match.isCompleted
        ? !match.winner
            ? 'DRAW'
            : match.winner.uuid === currentUser?.uuid
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

    const cardContent = (
        <Stack spacing={1} flexGrow={1}>
            <Typography variant="body2" color="text.secondary" textAlign={isStatic ? 'center' : 'left'}>
                {formattedDate}
            </Typography>

            <Box display="flex" gap={2} alignItems="center" py={1} justifyContent={isStatic ? 'center' : 'flex-start'}>
                <img src="/kw.png" height={40} />
                <Typography variant="h6">
                    {match.whitePlayer.username} vs {match.blackPlayer.username}
                </Typography>
                <img src="/kb.png" height={40} />
            </Box>

            <Box display="flex" gap={1} flexWrap="wrap" justifyContent={isStatic ? 'center' : 'flex-start'}>
                <Chip icon={mode?.icon} label={mode?.label ?? match.mode} />
                <Chip
                    icon={
                        match.isRanked ? <EmojiEvents fontSize="small" /> : <SentimentVerySatisfied fontSize="small" />
                    }
                    label={match.isRanked ? 'Ranked' : 'Unranked'}
                    color="primary"
                />
                <Chip label={result} color={resultColor as any} />
            </Box>
        </Stack>
    );

    if (isStatic) {
        return (
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                {cardContent}
            </Paper>
        );
    }

    return (
        <Paper
            component={Link}
            to={`/history/${match.id}`}
            elevation={3}
            sx={{
                p: 2,
                borderRadius: 2,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 1,
            }}
        >
            {cardContent}

            {!match.isCompleted && (
                <Box
                    ml="auto"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <Button variant="contained" component={Link} to={`/match/${match.id}`}>Rejoin</Button>
                </Box>
            )}
        </Paper>
    );
}
