import { User } from './users';

export interface FriendRelation {
    id: string;
    firstUser: User;
    secondUser: User;
    createdAt: string;
    befriendedAt?: string;
}

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export async function fetchFriends(token: string): Promise<FriendRelation[]> {
    const res = await fetch(`${API_BASE}friends/current-user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Failed to fetch friends');
    return res.json();
}

export async function fetchReceivedRequests(token: string): Promise<FriendRelation[]> {
    const res = await fetch(`${API_BASE}friends/current-user/received`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Failed to fetch received requests');
    return res.json();
}

export async function fetchSentRequests(token: string): Promise<FriendRelation[]> {
    const res = await fetch(`${API_BASE}friends/current-user/sent`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Failed to fetch sent requests');
    return res.json();
}

export async function sendFriendRequest(token: string, userId: string): Promise<FriendRelation> {
    const res = await fetch(`${API_BASE}friends/sent/${userId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Failed to send friend request');
    return res.json();
}

export async function acceptFriendRequest(token: string, requestId: string): Promise<FriendRelation> {
    const res = await fetch(`${API_BASE}friends/accept/${requestId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Failed to accept friend request');
    return res.json();
}

export async function removeFriend(token: string, requestId: string): Promise<void> {
    const res = await fetch(`${API_BASE}friends/remove/${requestId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Failed to remove friend');
}
