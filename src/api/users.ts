import { Rating } from './ratings';
import { toSearchParams } from './utils';

export interface User {
    uuid: string;
    username: string;
    createdAt: string;
    imageUrl: string | null;
    followersCount?: number;
    ratings?: Rating[];
    followed_users?: string[];
    followers?: string[];
}

export async function fetchUsers(params: {
    offset: number;
    limit: number;
    sortBy: string;
    order: string;
    search?: string;
}): Promise<User[]> {
    const query = toSearchParams(params);

    if (params.search) {
        query.set('search', params.search);
    }

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}user?${query}`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
}

export async function fetchCurrentUser(token: string): Promise<User> {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/current-user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error('Failed to fetch current user');
    return res.json();
}
