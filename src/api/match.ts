import { User } from './users';
export interface Match {
    id: string;
    whitePlayer: User;
    blackPlayer: User;
    startAt: string;
    winner?: User;
    isCompleted: boolean[];
    endAt?: string;
    followers?: string[];
    mode: string;
    isRanked: boolean;
    moves: object[];
    boardState: boardState;
}

interface boardState {
    board: string;
    remainingBlackTime: number;
    remainingWhiteTime: number;
    turn: 'white' | 'black';
}

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export async function fetchMatch(matchId: string): Promise<Match> {
    const res = await fetch(`${API_BASE}match/${matchId}`);
    if (!res.ok) throw new Error('Failed to fetch friends');
    return res.json();
}
