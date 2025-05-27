import { List, ListItemButton, Typography, Stack, Paper, Box } from '@mui/material';
import { ArrowRightAlt } from '@mui/icons-material';
import { Move } from '../../api/moves';
import { getSquareCoords } from '../../utils/getSquareCoords';
import { parseFEN } from '../../utils/parseFEN';
import { applyMoves } from '../../utils/simulateBoard';

interface MoveListPanelProps {
    moves: Move[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function MoveListPanel({ moves, selectedIndex, onSelect }: MoveListPanelProps) {
    const userColor = 'white';

    const initialBoard = parseFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', userColor)!;
    const boardStates: (string | null)[][][] = [];
    let currentBoard = structuredClone(initialBoard);

    for (let i = 0; i < moves.length; i++) {
        boardStates.push(currentBoard);
        currentBoard = applyMoves(currentBoard, [moves[i]]);
    }

    return (
        <Paper elevation={2} sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Typography p={2}>Moves made</Typography>
            <List dense>
                {moves.map((move, idx) => {
                    const board = boardStates[idx];
                    const [fromRow, fromCol] = getSquareCoords(move.from, userColor);
                    const piece = board?.[fromRow]?.[fromCol];

                    return (
                        <ListItemButton key={move.id} selected={idx === selectedIndex} onClick={() => onSelect(idx)}>
                            <Stack direction="row" spacing={2} p={1} alignItems="center" width="100%">
                                {piece && (
                                    <Box width={24} height={24}>
                                        <img src={piece} alt="piece" width="100%" height="100%" />
                                    </Box>
                                )}
                                <Typography variant="h5">{move.from}</Typography>
                                <ArrowRightAlt />
                                <Typography variant="h5" width={80}>
                                    {move.to}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ marginLeft: 'auto' }}>
                                    {formatTime(move.timeLeft)}
                                </Typography>
                            </Stack>
                        </ListItemButton>
                    );
                })}
            </List>
        </Paper>
    );
}
