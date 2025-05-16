import { Typography, Box } from '@mui/material';
import LoginRequiredNotice from '../components/misc/LoginRequiredNotice';
import PageHeader from '../components/misc/PageHeader';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function Lobby() {
    const { data: currentUser } = useCurrentUser();

    return (
        <Box px={4} py={6}>
            <PageHeader title="Game Lobby" />
            {!!currentUser ? <Typography variant="body1">In development...</Typography> : <LoginRequiredNotice />}
        </Box>
    );
}
