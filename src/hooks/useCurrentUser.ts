import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchCurrentUser, User } from '../api/users';
import { useAuth0 } from '@auth0/auth0-react';

export function useCurrentUser(): UseQueryResult<User, Error> {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const token = await getAccessTokenSilently();
            return fetchCurrentUser(token);
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
}
