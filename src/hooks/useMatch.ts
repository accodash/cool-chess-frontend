import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchMatch, Match } from '../api/match';

export function useMatch(matchId: string): UseQueryResult<Match, Error> {
    return useQuery({
        queryKey: ['match', matchId],
        queryFn: () => fetchMatch(matchId),
        placeholderData: (prevData) => prevData,
    });
}
