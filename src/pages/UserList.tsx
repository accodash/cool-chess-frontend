import { Box, Stack, Typography, CircularProgress } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import UserCard from '../components/social/UserCard';
import UserListControls from '../components/social/UserListControls';
import PaginationControls from '../components/PaginationControls';
import { useUsers } from '../hooks/useUsers';

const LIMIT = 50;

export default function UserList() {
    const [params, setParams] = useSearchParams();

    const page = parseInt(params.get('page') || '1', 10);
    const sortBy = params.get('sortBy') || 'createdAt';
    const order = params.get('order') || 'DESC';
    const search = params.get('search') || '';

    const offset = (page - 1) * LIMIT;

    const { data: rawUsers = [], isLoading } = useUsers({
        offset,
        limit: LIMIT + 1,
        sortBy,
        order,
        search,
    });

    const users = rawUsers.slice(0, LIMIT);
    const hasNextPage = rawUsers.length > LIMIT;

    const handleSearchChange = (val: string) => {
        setParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set('search', val);
            newParams.set('page', '1');
            return newParams;
        });
    };

    const handleSortChange = (newSortBy: string, newOrder: string) => {
        setParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set('sortBy', newSortBy);
            newParams.set('order', newOrder);
            newParams.set('page', '1');
            return newParams;
        });
    };

    const handlePageChange = (delta: number) => {
        setParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', (page + delta).toString());
            return newParams;
        });
    };

    return (
        <Box px={4} py={6}>
            <Typography variant="h4" mb={2}>
                User List
            </Typography>

            <UserListControls
                search={search}
                sortBy={sortBy}
                order={order}
                onSearchChange={handleSearchChange}
                onSortChange={handleSortChange}
            />

            {isLoading ? (
                <Box textAlign="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <Stack spacing={2}>
                    {users.map((user, idx) => (
                        <UserCard
                            key={user.uuid}
                            index={(page - 1) * LIMIT + idx + 1}
                            username={user.username}
                            createdAt={user.createdAt}
                            imageUrl={user.imageUrl}
                            followersCount={user.followersCount}
                        />
                    ))}
                </Stack>
            )}

            <PaginationControls page={page} hasNext={hasNextPage} onChange={handlePageChange} />
        </Box>
    );
}
