import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import PageHeader from '../components/misc/PageHeader';
import { useMatch } from '../hooks/useMatch';
import { useMatchLogic } from '../hooks/useMatchLogic';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const pieceUnicode = {
    r: '/rb.png',
    n: '/nb.png',
    b: '/bb.png',
    q: '/qb.png',
    k: '/kb.png',
    p: '/pb.png',
    R: '/rw.png',
    N: '/nw.png',
    B: '/bw.png',
    Q: '/qw.png',
    K: '/kw.png',
    P: '/pw.png',
};

const allChars = 'rnbqkpRNBQKP';

function parseFEN(fen: string | undefined, color: 'white' | 'black') {
    if (!fen || !fen.includes(' ')) return;
    let [piecePlacement] = fen.split(' ');

    if (color === 'black') {
        piecePlacement = piecePlacement.split('').reverse().join('');
    }

    const rows = piecePlacement.split('/');
    const board = [];

    for (let row of rows) {
        const boardRow = [];
        for (let char of row) {
            if (isNaN(Number(char))) {
                if (allChars.includes(char)) {
                    boardRow.push(pieceUnicode[char as keyof typeof pieceUnicode]);
                }
            } else {
                for (let i = 0; i < parseInt(char, 10); i++) {
                    boardRow.push(null);
                }
            }
        }
        board.push(boardRow);
    }

    return board;
}

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

    function handleSquareClick(colIndex: number, rowIndex: number, piece: string | null) {
        const LETTERS = usersColor === 'white' ? 'abcdefgh' : 'hgfedcba';
        const rank = usersColor === 'white' ? 8 - rowIndex : rowIndex + 1;
        const file = LETTERS[colIndex];
        const position = `${file}${rank}`;

        if (highlightedSquares.has(position) && selectedSquare) {
            emitMove(selectedSquare, position);
            console.log(`tries to move from ${selectedSquare} to ${position}`);
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
            <PageHeader title={`Match ${id}`} />

            <Box
                display="grid"
                gridTemplateColumns="repeat(8, 60px)"
                gridTemplateRows="repeat(8, 60px)"
                border="2px solid black"
                mt={4}
            >
                {board &&
                    board.map((row, rowIndex) =>
                        row.map((image, colIndex) => {
                            const isDark = (rowIndex + colIndex) % 2 === 1;
                            const LETTERS = usersColor === 'white' ? 'abcdefgh' : 'hgfedcba';
                            const row = usersColor === 'white' ? 8 - rowIndex : rowIndex + 1;
                            const square = `${LETTERS[colIndex]}${row}`;
                            const isHighlighted = highlightedSquares.has(square);

                            return (
                                <Box
                                    key={`${rowIndex}-${colIndex}`}
                                    width={60}
                                    height={60}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontSize="32px"
                                    onClick={() => handleSquareClick(colIndex, rowIndex, image)}
                                    bgcolor={isHighlighted ? '#baca44' : isDark ? '#769656' : '#eeeed2'}
                                >
                                    {image && <img src={image} />}
                                </Box>
                            );
                        })
                    )}
            </Box>
        </Box>
    );
}
