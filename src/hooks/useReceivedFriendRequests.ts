import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchReceivedRequests, FriendRelation } from '../api/friends';
import { useAuth0 } from '@auth0/auth0-react';

export function useReceivedFriendRequests(): UseQueryResult<FriendRelation[], Error> {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    return useQuery({
        queryKey: ['friendRequests', 'received'],
        queryFn: async () => {
            const token = await getAccessTokenSilently();
            return fetchReceivedRequests(token);
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
}
