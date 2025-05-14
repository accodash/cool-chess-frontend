import { useQuery } from '@tanstack/react-query';
import { fetchFollowers } from '../api/followings';

export function useFollowers(userId: string) {
    return useQuery({
        queryKey: ['followers', userId],
        queryFn: () => fetchFollowers(userId),
        enabled: !!userId,
    });
}
