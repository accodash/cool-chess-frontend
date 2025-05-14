import { uploadUserAvatar } from '../api/users';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUploadAvatar() {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file: File) => {
            const token = await getAccessTokenSilently();
            return uploadUserAvatar(token, file);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
    });
}
