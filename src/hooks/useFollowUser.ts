import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followUser } from '../api/followings';
import { useCurrentUser } from './useCurrentUser';

export function useFollowUser() {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();
    const { data: currentUser } = useCurrentUser();

    return useMutation({
        mutationFn: async (userId: string) => {
            const token = await getAccessTokenSilently();
            return followUser(token, userId);
        },
        onSuccess: (_, uuid) => {
            queryClient.invalidateQueries({ queryKey: ['followers', uuid] });
            queryClient.invalidateQueries({ queryKey: ['user', uuid] });
            queryClient.invalidateQueries({ queryKey: ['followings', currentUser?.uuid] });
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
    });
}
