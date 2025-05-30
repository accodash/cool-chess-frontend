import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unfollowUser } from '../api/followings';
import { useCurrentUser } from './useCurrentUser';

export function useUnfollowUser() {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();
    const { data: currentUser } = useCurrentUser();

    return useMutation({
        mutationFn: async (userId: string) => {
            const token = await getAccessTokenSilently();
            return unfollowUser(token, userId);
        },
        onSuccess: (_, uuid) => {
            queryClient.invalidateQueries({ queryKey: ['followers', uuid] });
            queryClient.invalidateQueries({ queryKey: ['user', uuid] });
            queryClient.invalidateQueries({ queryKey: ['followings', currentUser?.uuid] });
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
    });
}
