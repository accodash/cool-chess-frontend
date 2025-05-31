import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { fetchPossibleMovesForMatch } from '../api/match';
import { useAuth0 } from '@auth0/auth0-react';

interface MatchStatus {
    status: 'win' | 'draw';
    userId: string;
}
interface TimerStatus {
    userId: string;
    timeLeft: number;
}
export function useMatchLogic(
    matchId: string,
    userId: string,
    onMoveMade: () => void,
    setResult: Dispatch<SetStateAction<'win' | 'draw' | 'loss' | null>>,
    setTimer: Dispatch<
        React.SetStateAction<{
            [x: string]: number;
        }>
    >
) {
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
        socket.on('status', (payload: MatchStatus) => {
            if (payload.status === 'win') {
                setResult(payload.userId === userId ? 'win' : 'loss');
            } else {
                setResult('draw');
            }
        });
        socket.on('time-update', (payload: TimerStatus) => {
            setTimer((prev) => ({
                ...prev,
                [payload.userId]: payload.timeLeft,
            }));
        });
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
