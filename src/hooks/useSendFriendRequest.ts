import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendFriendRequest } from '../api/friends';
import { useAuth0 } from '@auth0/auth0-react';

export function useSendFriendRequest() {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: string) => {
            const token = await getAccessTokenSilently();
            return sendFriendRequest(token, userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friendRequests', 'sent'] });
        },
    });
}
