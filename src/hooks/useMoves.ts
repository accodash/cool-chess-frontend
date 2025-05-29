import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchMoves, Move } from '../api/moves';

export function useMoves(matchId: string): UseQueryResult<Move[], Error> {
    return useQuery({
        queryKey: ['moves', matchId],
        queryFn: () => fetchMoves(matchId),
        placeholderData: (prevData) => prevData,
    });
}
