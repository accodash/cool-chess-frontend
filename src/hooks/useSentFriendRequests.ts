import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchSentRequests, FriendRelation } from '../api/friends';
import { useAuth0 } from '@auth0/auth0-react';

export function useSentFriendRequests(): UseQueryResult<FriendRelation[], Error> {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    return useQuery({
        queryKey: ['friendRequests', 'sent'],
        queryFn: async () => {
            const token = await getAccessTokenSilently();
            return fetchSentRequests(token);
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
}
