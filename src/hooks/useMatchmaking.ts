import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useMatchmaking(onMatchFound: (data: any) => void) {
    const socketRef = useRef<Socket | null>(null);
    const { getAccessTokenSilently } = useAuth0();

    const startMatchmaking = async (userId: string, gamemode: string) => {
        if (!userId) return;

        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        const token = await getAccessTokenSilently();
        const socket = io(import.meta.env.VITE_BACKEND_URL, {
            auth: {
                token: `Bearer ${token}`,
            },
        });
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
