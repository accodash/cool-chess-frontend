import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchFriends, FriendRelation } from '../api/friends';
import { useAuth0 } from '@auth0/auth0-react';

export function useFriends(): UseQueryResult<FriendRelation[], Error> {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    return useQuery({
        queryKey: ['friends'],
        queryFn: async () => {
            const token = await getAccessTokenSilently();
            return fetchFriends(token);
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
}
