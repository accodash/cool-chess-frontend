import { Box, CircularProgress, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ModeSelector from '../components/ranking/ModeSelector';
import RankingList from '../components/ranking/RankingList';
import PaginationControls from '../components/PaginationControls';

interface User {
    uuid: string;
    username: string;
    createdAt: string;
    imageUrl: string | null;
}

interface RankingEntry {
    id: string;
    rating: number;
    mode: string;
    user: User;
}

export default function Ranking() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setData] = useState<RankingEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);

    const mode = searchParams.get('mode') || 'bullet';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 50;
    const offset = (page - 1) * limit;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}rating/ranking?mode=${mode}&offset=${offset}&limit=${limit + 1}`
                );
                const result = await response.json();
                setHasNextPage(result.length > limit);
                setData(result.slice(0, limit));
            } catch (err) {
                console.error('Failed to load ranking:', err);
            }
            setLoading(false);
        };
        fetchData();
    }, [mode, offset]);

    const handleModeChange = (newMode: string) => {
        setSearchParams({ mode: newMode, page: '1' });
    };

    const handlePageChange = (delta: number) => {
        setSearchParams({ mode, page: (page + delta).toString() });
    };

    return (
        <Box sx={{ px: 4, py: 6 }}>
            <Typography variant='h4' gutterBottom>
                {mode.charAt(0).toUpperCase() + mode.slice(1)} Ranking
            </Typography>

            <ModeSelector selectedMode={mode} onSelect={handleModeChange} />

            {loading ? (
                <CircularProgress />
            ) : (
                <RankingList entries={data} offset={offset} />
            )}

            <PaginationControls
                page={page}
                hasNext={hasNextPage}
                onChange={handlePageChange}
            />
        </Box>
    );
}
