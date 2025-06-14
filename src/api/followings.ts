import { User } from './users';

export interface Following {
    id: string;
    follower?: User;
    followedUser?: User;
}

export async function fetchFollowers(userId: string): Promise<Following[]> {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}following/followers/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch followers');
    return res.json();
}

export async function fetchFollowings(userId: string): Promise<Following[]> {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}following/followings/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch followings');
    return res.json();
}

export async function followUser(token: string, targetUserId: string): Promise<void> {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}following/followers/${targetUserId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to follow user');
    }
}

export async function unfollowUser(token: string, targetUserId: string): Promise<void> {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}following/followers/${targetUserId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to unfollow user');
    }
}
