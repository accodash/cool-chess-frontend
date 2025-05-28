import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import PageHeader from '../components/misc/PageHeader';
import { useMatch } from '../hooks/useMatch';
import { useMatchLogic } from '../hooks/useMatchLogic';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ChessBoard from '../components/match/ChessBoard';
import { parseFEN } from '../utils/parseFEN';

export default function Match() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: currentUser } = useCurrentUser();

    if (!currentUser) {
        navigate('/');
        return null;
    }

    if (!id) {
        navigate('/play');
        return null;
    }

    const { data, isLoading, isError } = useMatch(id);
    const { enterMatch, getPossibleMoves, emitMove } = useMatchLogic(id, currentUser.uuid, () => {
        queryClient.invalidateQueries({ queryKey: ['match', id] });
        console.log('it moved huh');
    });
    const { data: possibleMoves = {}, isLoading: loadingMoves } = getPossibleMoves();

    useEffect(() => {
        if (enterMatch) {
            enterMatch();
        }
    }, [enterMatch]);

    const usersColor = data?.blackPlayer.uuid === currentUser?.uuid ? 'black' : 'white';
    const fen = data?.boardState.board;
    const board = parseFEN(fen, usersColor);

    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [highlightedSquares, setHighlightedSquares] = useState<Set<string>>(new Set());

    function handleSquareClick(colIndex: number, rowIndex: number, hasPiece: boolean) {
        const LETTERS = usersColor === 'white' ? 'abcdefgh' : 'hgfedcba';
        const rank = usersColor === 'white' ? 8 - rowIndex : rowIndex + 1;
        const file = LETTERS[colIndex];
        const position = `${file}${rank}`;

        if (highlightedSquares.has(position) && selectedSquare) {
            emitMove(selectedSquare, position);
            console.log(`tries to move from ${selectedSquare} to ${position}`);
        }

        if (!hasPiece) {
            setSelectedSquare(null);
            setHighlightedSquares(new Set());
            return;
        }

        const moves = possibleMoves[position];
        if (moves && moves.length > 0) {
            setSelectedSquare(position);
            setHighlightedSquares(new Set(moves.map((m) => m.to)));
        } else {
            setSelectedSquare(null);
            setHighlightedSquares(new Set());
        }
    }

    return (
        <Box px={4} py={6}>
            <PageHeader title={`Match ${id}`} />

            {board && (
                <Box mt={4}>
                    <ChessBoard
                        board={board}
                        userColor={usersColor}
                        highlightedSquares={highlightedSquares}
                        onSquareClick={handleSquareClick}
                    />
                </Box>
            )}
        </Box>
    );
}
