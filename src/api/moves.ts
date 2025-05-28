export interface Move {
    id: string;
    from: string;
    to: string;
    movedAt: string;
    timeLeft: number;
}

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export async function fetchMoves(matchId: string): Promise<Move[]> {
    const res = await fetch(`${API_BASE}move/list/${matchId}`);
    if (!res.ok) throw new Error('Failed to fetch moves');
    return res.json();
}
