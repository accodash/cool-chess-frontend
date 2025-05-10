import { Typography, Box } from '@mui/material';
import LoginRequiredNotice from '../components/misc/LoginRequiredNotice';

interface HistoryProps {
    loggedIn: boolean;
}

export default function History({ loggedIn }: HistoryProps) {
    return (
        <Box px={4} py={6}>
            <Typography variant='h4' gutterBottom>
                Game History
            </Typography>
            {loggedIn ? (
                <Typography variant='body1'>In development...</Typography>
            ) : (
                <LoginRequiredNotice />
            )}
        </Box>
    );
}
