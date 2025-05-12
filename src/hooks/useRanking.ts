import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchRanking, Rating } from '../api/ratings';

export function useRanking(params: {
    mode: string;
    offset: number;
    limit: number;
}): UseQueryResult<Rating[], Error> {
    return useQuery({
        queryKey: ['ranking', params],
        queryFn: () => fetchRanking(params),
        placeholderData: (prevData) => prevData,
    });
}
