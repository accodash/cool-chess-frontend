import { Box, CircularProgress, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import ModeSelector from '../components/ranking/ModeSelector';
import RankingList from '../components/ranking/RankingList';
import PaginationControls from '../components/PaginationControls';
import PageHeader from '../components/misc/PageHeader';
import { useRanking } from '../hooks/useRanking';

const LIMIT = 50;

export default function Ranking() {
    const [searchParams, setSearchParams] = useSearchParams();

    const mode = searchParams.get('mode') || 'bullet';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const offset = (page - 1) * LIMIT;

    const { data = [], isLoading, isError } = useRanking({ mode, offset, limit: LIMIT + 1 });

    const hasNextPage = data.length > LIMIT;

    const handleModeChange = (newMode: string) => {
        setSearchParams({ mode: newMode, page: '1' });
    };

    const handlePageChange = (delta: number) => {
        setSearchParams({ mode, page: (page + delta).toString() });
    };

    return (
        <Box px={4} py={6}>
            <PageHeader title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} Ranking`} />

            <ModeSelector selectedMode={mode} onSelect={handleModeChange} />

            {isLoading ? (
                <CircularProgress />
            ) : isError ? (
                <Typography color="error">Failed to load ranking. Please try again later.</Typography>
            ) : (
                <RankingList entries={data.slice(0, LIMIT)} offset={offset} />
            )}

            <PaginationControls page={page} hasNext={hasNextPage} onChange={handlePageChange} />
        </Box>
    );
}
