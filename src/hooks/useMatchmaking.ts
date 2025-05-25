import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useMatchmaking(onMatchFound: (data: any) => void) {
    const socketRef = useRef<Socket | null>(null);

    const startMatchmaking = (userId: string, gamemode: string) => {
        if (!userId) return;

        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        const socket = io(import.meta.env.VITE_BACKEND_URL);
        socketRef.current = socket;

        socket.emit('join-queue', { userId, gamemode });

        socket.on('match-found', onMatchFound);
    };

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    return { startMatchmaking };
}
