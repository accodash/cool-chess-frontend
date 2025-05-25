import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { fetchPossibleMovesForMatch } from '../api/match';

// Trzeba sie pozbyc userId stąd to ma być automatyczne ne BE
// Ale sockety są zwalone musze zmenić ich init aby działało
export function useMatchLogic(matchId: string, userId: string, onMoveMade: () => void) {
    const socketRef = useRef<Socket | null>(null);

    const enterMatch = () => {
        if (!socketRef.current) {
            const socket = io(import.meta.env.VITE_BACKEND_URL);
            socketRef.current = socket;
        }

        const socket = socketRef.current;
        socket.emit('enter-match', {
            matchId,
            userId,
        });

        socket.on('move-made', onMoveMade);
    };

    const getPossibleMoves = () => {
        return useQuery({
            queryKey: ['match', matchId, 'moves'],
            queryFn: () => fetchPossibleMovesForMatch(matchId),
            placeholderData: (prevData) => prevData,
        });
    };

    const emitMove = (from: string, to: string) => {
        const socket = socketRef.current;
        if (!socket) return;
        socket.emit('make-move', {
            from,
            to,
            matchId,
            userId,
        });
    };

    return { enterMatch, getPossibleMoves, emitMove };
}
