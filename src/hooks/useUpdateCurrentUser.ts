import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCurrentUser } from '../api/users';
import { useAuth0 } from '@auth0/auth0-react';

export function useUpdateCurrentUser() {
    const queryClient = useQueryClient();
    const { getAccessTokenSilently } = useAuth0();

    return useMutation({
        mutationFn: async (data: { username?: string | null; imageUrl?: string | null }) => {
            const token = await getAccessTokenSilently();
            return updateCurrentUser(token, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
    });
}
