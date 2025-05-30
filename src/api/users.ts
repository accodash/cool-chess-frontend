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

export async function fetchUserById(id: string): Promise<User> {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/${id}`);
    if (!res.ok) {
        throw new Error('Failed to fetch user');
    }
    return res.json();
}

export async function updateCurrentUser(token: string, data: { username?: string | null; imageUrl?: string | null }): Promise<User> {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/current-user`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
}

export async function uploadUserAvatar(token: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/current-user/upload/avatar`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) throw new Error('Failed to upload avatar');
    const data = await res.json();
    return data.imageUrl;
}
