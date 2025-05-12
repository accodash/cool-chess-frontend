import { Typography, Box } from '@mui/material';
import LoginRequiredNotice from '../components/misc/LoginRequiredNotice';
import PageHeader from '../components/misc/PageHeader';

interface HistoryProps {
    loggedIn: boolean;
}

export default function History({ loggedIn }: HistoryProps) {
    return (
        <Box px={4} py={6}>
            <PageHeader title='Game History' />
            {loggedIn ? (
                <Typography variant='body1'>In development...</Typography>
            ) : (
                <LoginRequiredNotice />
            )}
        </Box>
    );
}
