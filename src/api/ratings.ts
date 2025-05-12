import { User } from './users';
import { toSearchParams } from './utils';

export interface Rating {
    id: string;
    rating: number;
    mode: string;
    user?: User;
}

export async function fetchRanking(params: {
    mode: string;
    offset: number;
    limit: number;
}): Promise<Rating[]> {
    const query = toSearchParams(params);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}rating/ranking?${query}`);
    if (!res.ok) throw new Error('Failed to fetch ranking');
    return res.json();
}