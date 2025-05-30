import { Box, CircularProgress, Stack } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import PaginationControls from '../components/misc/PaginationControls';
import MatchCard from '../components/match/MatchCard';
import PageHeader from '../components/misc/PageHeader';
import { useCurrentUser } from '../hooks/useCurrentUser';
import LoginRequiredNotice from '../components/misc/LoginRequiredNotice';

const LIMIT = 10;

export default function History() {
    const { data: currentUser } = useCurrentUser();
    const [params, setParams] = useSearchParams();
    const page = parseInt(params.get('page') || '1', 10);
    const offset = (page - 1) * LIMIT;

    const { data: rawMatches = [], isLoading } = useMatches({
        offset,
        limit: LIMIT + 1,
    });

    const matches = rawMatches.slice(0, LIMIT);
    const hasNextPage = rawMatches.length > LIMIT;

    const handlePageChange = (delta: number) => {
        setParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', (page + delta).toString());
            return newParams;
        });
    };

    if (!currentUser) {
        return (
            <Box px={4} py={6}>
                <PageHeader title="Game History" />
                <LoginRequiredNotice />
            </Box>
        );
    }

    return (
        <Box px={4} py={6}>
            <PageHeader title="Game History" />

            {isLoading ? (
                <Box textAlign="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <Stack spacing={2}>
                    {matches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                    ))}
                </Stack>
            )}

            <PaginationControls page={page} hasNext={hasNextPage} onChange={handlePageChange} />
        </Box>
    );
}
