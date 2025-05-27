import { List, ListItemButton, Typography, Stack, Paper } from '@mui/material';
import { ArrowRightAlt } from '@mui/icons-material';
import { Move } from '../../api/moves';

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
    return (
        <Paper elevation={2}>
            <Typography p={2}>Moves made</Typography>
            <List dense sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
                {moves.map((move, idx) => (
                    <ListItemButton key={move.id} selected={idx === selectedIndex} onClick={() => onSelect(idx)}>
                        <Stack direction="row" spacing={2} p={1} alignItems="center" width="100%">
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
                ))}
            </List>
        </Paper>
    );
}
