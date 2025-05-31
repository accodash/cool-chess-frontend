import { Avatar, Box, Typography } from '@mui/material';
import { User } from '../../api/users';
import { Person } from '@mui/icons-material';
import { formatTime } from '../../utils/formatTime';

interface PlayerInfoProps {
    player: User;
    color: 'white' | 'black';
    timeLeft: number;
}

export default function PlayerInfo({ player, color, timeLeft }: PlayerInfoProps) {
    return (
        <Box py={1} display="flex" alignItems="center" gap={2}>
            <Avatar src={player.imageUrl ?? undefined} sx={{ width: 56, height: 56 }}>
                {!player.imageUrl && <Person fontSize="large" />}
            </Avatar>
            <Typography variant="h6" flexGrow="1">
                {player.username}
            </Typography>
            <Typography variant="h5" pl={4}>
                {formatTime(timeLeft * 1000)}
            </Typography>
            <img src={color === 'black' ? '/kb.png' : '/kw.png'} height={40} />
        </Box>
    );
}
