import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { fetchPossibleMovesForMatch } from '../api/match';
import { useAuth0 } from '@auth0/auth0-react';

export function useMatchLogic(matchId: string, userId: string, onMoveMade: () => void) {
    const socketRef = useRef<Socket | null>(null);
    const { getAccessTokenSilently } = useAuth0();

    const possibleMovesQuery = useQuery({
        queryKey: ['match', matchId, 'moves'],
        queryFn: () => fetchPossibleMovesForMatch(matchId),
        placeholderData: (prevData) => prevData,
        enabled: !!matchId,
    });

    const getSocket = async () => {
        if (!socketRef.current) {
            const token = await getAccessTokenSilently();
            const socket = io(import.meta.env.VITE_BACKEND_URL, {
                auth: {
                    token: `Bearer ${token}`,
                },
            });
            socketRef.current = socket;
            socket.emit('enter-match', {
                matchId,
                userId,
            });
        }
        return socketRef.current;
    };

    const enterMatch = async () => {
        const socket = await getSocket();
        socket.on('move-made', onMoveMade);
    };

    const emitMove = async (from: string, to: string) => {
        const socket = await getSocket();
        socket.emit('make-move', {
            from,
            to,
            matchId,
            userId,
        });
    };

    return {
        enterMatch,
        emitMove,
        possibleMoves: possibleMovesQuery.data || {},
        loadingMoves: possibleMovesQuery.isLoading,
    };
}
