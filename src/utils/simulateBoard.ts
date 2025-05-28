import { Move } from '../api/moves';

export function cloneBoard(board: (string | null)[][]): (string | null)[][] {
    return board.map((row) => [...row]);
}

export function applyMoves(board: (string | null)[][], moves: Move[]): (string | null)[][] {
    const newBoard = cloneBoard(board);

    for (const move of moves) {
        const fromCol = move.from.charCodeAt(0) - 'a'.charCodeAt(0);
        const fromRow = 8 - parseInt(move.from[1], 10);
        const toCol = move.to.charCodeAt(0) - 'a'.charCodeAt(0);
        const toRow = 8 - parseInt(move.to[1], 10);

        newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
        newBoard[fromRow][fromCol] = null;
    }

    return newBoard;
}
