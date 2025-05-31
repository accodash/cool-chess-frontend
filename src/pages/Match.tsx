import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import PageHeader from '../components/misc/PageHeader';
import { useMatch } from '../hooks/useMatch';
import { useMatchLogic } from '../hooks/useMatchLogic';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ChessBoard from '../components/match/ChessBoard';
import { parseFEN } from '../utils/parseFEN';
import { useAuth0 } from '@auth0/auth0-react';
import PlayerInfo from '../components/match/PlayerInfo';

export default function Match() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isLoading: auth0Loading } = useAuth0();
    const { data: currentUser, isLoading: loadingUser } = useCurrentUser();
    const { data, isLoading, isError } = useMatch(id || '');

    const [result, setResult] = useState<null | 'win' | 'loss' | 'draw'>(null);
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [highlightedSquares, setHighlightedSquares] = useState<Set<string>>(new Set());

    const [timers, setTimers] = useState<{ [uuid: string]: number }>({});

    const invalidateQueries = () => {
        queryClient.invalidateQueries({ queryKey: ['match', id] });
    };

    const { enterMatch, emitMove, possibleMoves } = useMatchLogic(
        id || '',
        currentUser?.uuid || '',
        invalidateQueries,
        setResult,
        setTimers
    );

    useEffect(() => {
        if (!id) {
            navigate('/play');
        }
    }, [id, navigate]);

    useEffect(() => {
        if (!auth0Loading && !loadingUser && currentUser == null) {
            navigate('/');
        }
    }, [auth0Loading, loadingUser, currentUser, navigate]);

    useEffect(() => {
        if (enterMatch && currentUser && id) {
            enterMatch();
        }
    }, [enterMatch, currentUser, id]);

    useEffect(() => {
        if (data?.blackPlayer && data.whitePlayer && data.boardState) {
            setTimers({
                [data.blackPlayer.uuid]: data.boardState.remainingBlackTime,
                [data.whitePlayer.uuid]: data.boardState.remainingWhiteTime,
            });
        }
    }, [data]);

    if (auth0Loading || loadingUser || !currentUser || !id) return null;
    if (isLoading) {
        return (
            <Box px={4} py={6}>
                Loading match...
            </Box>
        );
    }
    if (isError || !data) {
        return (
            <Box px={4} py={6}>
                Error loading match
            </Box>
        );
    }

    const usersColor = data.blackPlayer.uuid === currentUser.uuid ? 'black' : 'white';
    const fen = data.boardState.board;
    const board = parseFEN(fen, usersColor);

    function handleSquareClick(colIndex: number, rowIndex: number, piece: string | null) {
        const LETTERS = usersColor === 'white' ? 'abcdefgh' : 'hgfedcba';
        const rank = usersColor === 'white' ? 8 - rowIndex : rowIndex + 1;
        const file = LETTERS[colIndex];
        const position = `${file}${rank}`;

        if (highlightedSquares.has(position) && selectedSquare) {
            emitMove(selectedSquare, position);
        }

        if (!piece) {
            setSelectedSquare(null);
            setHighlightedSquares(new Set());
            return;
        }

        const moves = possibleMoves[position];
        if (moves && moves.length > 0 && piece[2] === usersColor[0]) {
            setSelectedSquare(position);
            setHighlightedSquares(new Set(moves.map((m) => m.to)));
        } else {
            setSelectedSquare(null);
            setHighlightedSquares(new Set());
        }
    }

    return (
        <Box px={4} py={6}>
            <PageHeader title="Match" />
            <Dialog open={result !== null} onClose={() => setResult(null)}>
                <DialogTitle>Game Over</DialogTitle>
                <DialogContent>
                    <Typography>
                        {result === 'win' && '🎉 You won!'}
                        {result === 'loss' && '😞 You lost!'}
                        {result === 'draw' && "🤝 It's a draw!"}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate('/play')} variant="contained">
                        Back to Play
                    </Button>
                    <Button onClick={() => setResult(null)} variant="outlined">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            {board && (
                <Box mt={4} display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <PlayerInfo
                        player={usersColor === 'black' ? data.whitePlayer : data.blackPlayer}
                        color={usersColor === 'black' ? 'white' : 'black'}
                        timeLeft={
                            (timers[usersColor === 'black' ? data.whitePlayer.uuid : data.blackPlayer.uuid] ?? 0) * 1000
                        }
                    />
                    <ChessBoard
                        board={board}
                        userColor={usersColor}
                        highlightedSquares={highlightedSquares}
                        onSquareClick={handleSquareClick}
                    />
                    <PlayerInfo
                        player={usersColor === 'black' ? data.blackPlayer : data.whitePlayer}
                        color={usersColor}
                        timeLeft={
                            (timers[usersColor === 'black' ? data.blackPlayer.uuid : data.whitePlayer.uuid] ?? 0) * 1000
                        }
                    />
                </Box>
            )}
        </Box>
    );
}
