import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptFriendRequest } from '../api/friends';
import { useAuth0 } from '@auth0/auth0-react';

export function useAcceptFriendRequest() {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (requestId: string) => {
            const token = await getAccessTokenSilently();
            return acceptFriendRequest(token, requestId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friendRequests', 'received'] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });
        },
    });
}
