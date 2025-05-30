import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeFriend } from '../api/friends';
import { useAuth0 } from '@auth0/auth0-react';

export function useRemoveFriend() {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (requestId: string) => {
            const token = await getAccessTokenSilently();
            return removeFriend(token, requestId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friends'] });
            queryClient.invalidateQueries({ queryKey: ['friendRequests', 'sent'] });
            queryClient.invalidateQueries({ queryKey: ['friendRequests', 'received'] });
        },
    });
}
