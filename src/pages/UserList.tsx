import {
    Box,
    Stack,
    Typography,
    CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import UserCard from '../components/social/UserCard';
import UserListControls from '../components/social/UserListControls';
import PaginationControls from '../components/PaginationControls';

interface User {
    uuid: string;
    username: string;
    createdAt: string;
    imageUrl: string | null;
    followersCount: number;
}

const LIMIT = 50;

export default function UserList() {
    const [params, setParams] = useSearchParams();
    const [users, setUsers] = useState<User[]>([]);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(true);

    const page = parseInt(params.get('page') || '1', 10);
    const sortBy = params.get('sortBy') || 'createdAt';
    const order = params.get('order') || 'DESC';
    const search = params.get('search') || '';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const offset = (page - 1) * LIMIT;
            const query = new URLSearchParams({
                limit: (LIMIT + 1).toString(),
                offset: offset.toString(),
                sortBy,
                order,
            });
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}user?${query}`
            );
            const result = await res.json();
            const filtered = search
                ? result.filter((u: User) =>
                      u.username.toLowerCase().includes(search.toLowerCase())
                  )
                : result;
            setHasNextPage(filtered.length > LIMIT);
            setUsers(filtered.slice(0, LIMIT));
            setLoading(false);
        };
        fetchData();
    }, [params]);

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
            <Typography variant='h4' mb={2}>
                User List
            </Typography>

            <UserListControls
                search={search}
                sortBy={sortBy}
                order={order}
                onSearchChange={handleSearchChange}
                onSortChange={handleSortChange}
            />

            {loading ? (
                <Box textAlign='center' mt={5}>
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

            <PaginationControls
                page={page}
                hasNext={hasNextPage}
                onChange={handlePageChange}
            />
        </Box>
    );
}
