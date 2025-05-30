import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchUserById, User } from '../api/users';

export function useUserById(id: string): UseQueryResult<User, Error> {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => fetchUserById(id),
        enabled: !!id,
    });
}
