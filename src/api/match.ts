import { User } from './users';
import { toSearchParams } from './utils';

export interface Match {
    id: string;
    whitePlayer: User;
    blackPlayer: User;
    startAt: string;
    winner?: User;
    isCompleted: boolean;
    endAt?: string;
    followers?: string[];
    mode: string;
    isRanked: boolean;
    moves: object[];
    boardState: BoardState;
}

export interface MoveInfo {
    to: string;
    color: 'w' | 'b';
}

export interface MovesBySquare {
    [fromSquare: string]: MoveInfo[];
}

export interface BoardState {
    board: string;
    remainingBlackTime: number;
    remainingWhiteTime: number;
    turn: 'white' | 'black';
}

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export async function fetchMatches(
    params: {
        offset: number;
        limit: number;
    },
    token: string
): Promise<Match[]> {
    const query = toSearchParams(params);

    const res = await fetch(`${API_BASE}match/list?${query}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Failed to fetch matches');
    return res.json();
}

export async function fetchMatch(matchId: string): Promise<Match> {
    const res = await fetch(`${API_BASE}match/${matchId}`);
    if (!res.ok) throw new Error('Failed to fetch match');
    return res.json();
}

export async function fetchPossibleMovesForMatch(matchId: string): Promise<MovesBySquare> {
    const res = await fetch(`${API_BASE}match/${matchId}/get-moves`);
    if (!res.ok) throw new Error('Failed to fetch possible moves');
    return res.json();
}
