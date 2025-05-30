import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

interface ChessBoardProps {
    board: (string | null)[][];
    userColor: 'white' | 'black';
    highlightedSquares?: Set<string>;
    onSquareClick?: (colIndex: number, rowIndex: number, piece: string | null) => void;
}

function useWindowSize() {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
}

export default function ChessBoard({
    board,
    userColor,
    highlightedSquares = new Set(),
    onSquareClick,
}: ChessBoardProps) {
    const { width, height } = useWindowSize();
    const LETTERS = userColor === 'white' ? 'abcdefgh' : 'hgfedcba';

    // Calculate available board space
    const maxBoardWidth = width - 64; // padding/margin buffer
    const maxBoardHeight = height * 0.7; // 80vh max
    const boardSize = Math.min(maxBoardWidth, maxBoardHeight);
    const squareSize = Math.floor(boardSize / 8);

    return (
        <Box
            sx={{
                width: squareSize * 8,
                height: squareSize * 8,
                display: 'grid',
                gridTemplateColumns: `repeat(8, ${squareSize}px)`,
                gridTemplateRows: `repeat(8, ${squareSize}px)`,
                mx: 'auto', // center horizontally
            }}
        >
            {board.map((row, rowIndex) =>
                row.map((image, colIndex) => {
                    const isDark = (rowIndex + colIndex) % 2 === 1;
                    const rank = userColor === 'white' ? 8 - rowIndex : rowIndex + 1;
                    const file = LETTERS[colIndex];
                    const square = `${file}${rank}`;
                    const isHighlighted = highlightedSquares.has(square);

                    return (
                        <Box
                            key={`${rowIndex}-${colIndex}`}
                            width={squareSize}
                            height={squareSize}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            onClick={() => onSquareClick?.(colIndex, rowIndex, image)}
                            sx={{
                                bgcolor: isHighlighted ? '#baca44' : isDark ? '#769656' : '#eeeed2',
                                cursor: onSquareClick ? 'pointer' : 'default',
                            }}
                        >
                            {image && <img src={image} alt="piece" width="100%" />}
                        </Box>
                    );
                })
            )}
        </Box>
    );
}
