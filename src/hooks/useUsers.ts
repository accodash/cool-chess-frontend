import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchUsers, User } from '../api/users';

export function useUsers(params: {
    offset: number;
    limit: number;
    sortBy: string;
    order: string;
    search?: string;
}): UseQueryResult<User[], Error> {
    return useQuery({
        queryKey: ['users', params],
        queryFn: () => fetchUsers(params),
        placeholderData: (prevData) => prevData,
    });
}
