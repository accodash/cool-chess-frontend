import { useQuery } from '@tanstack/react-query';
import { fetchFollowings } from '../api/followings';

export function useFollowings(userId: string) {
    return useQuery({
        queryKey: ['followings', userId],
        queryFn: () => fetchFollowings(userId),
        enabled: !!userId,
    });
}
