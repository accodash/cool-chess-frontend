import { Typography, Box } from '@mui/material';
import LoginRequiredNotice from '../components/misc/LoginRequiredNotice';

interface LobbyProps {
    loggedIn: boolean;
}

export default function Lobby({ loggedIn }: LobbyProps) {
    return (
        <Box px={4} py={6}>
            <Typography variant='h4' gutterBottom>
                Lobby
            </Typography>
            {loggedIn ? (
                <Typography variant='body1'>In development...</Typography>
            ) : (
                <LoginRequiredNotice />
            )}
        </Box>
    );
}
