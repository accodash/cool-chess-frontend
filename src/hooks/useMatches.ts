import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchMatches, Match } from '../api/match';

export function useMatches(params: {
    offset: number;
    limit: number;
}): UseQueryResult<Match[], Error> {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    return useQuery({
        queryKey: ['matches', params],
        queryFn: async () => {
            const token = await getAccessTokenSilently();
            return fetchMatches(params, token);
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
}
