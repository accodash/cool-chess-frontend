import { Box } from '@mui/material';

interface ChessBoardProps {
    board: (string | null)[][];
    userColor: 'white' | 'black';
    highlightedSquares?: Set<string>;
    onSquareClick?: (colIndex: number, rowIndex: number, hasPiece: boolean) => void;
}

export default function ChessBoard({
    board,
    userColor,
    highlightedSquares = new Set(),
    onSquareClick,
}: ChessBoardProps) {
    const LETTERS = userColor === 'white' ? 'abcdefgh' : 'hgfedcba';

    return (
        <Box
            display="grid"
            gridTemplateColumns="repeat(8, 60px)"
            gridTemplateRows="repeat(8, 60px)"
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
                            width={60}
                            height={60}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            onClick={() => onSquareClick?.(colIndex, rowIndex, !!image)}
                            sx={{
                                bgcolor: isHighlighted
                                    ? '#baca44'
                                    : isDark
                                    ? '#769656'
                                    : '#eeeed2',
                                cursor: onSquareClick ? 'pointer' : 'default',
                            }}
                        >
                            {image && <img src={image} alt="piece" />}
                        </Box>
                    );
                })
            )}
        </Box>
    );
}
