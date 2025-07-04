import { Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useMatch } from '../hooks/useMatch';
import { useMoves } from '../hooks/useMoves';
import ChessBoard from '../components/match/ChessBoard';
import MoveListPanel from '../components/match/MoveListPanel';
import { useState, useMemo } from 'react';
import { applyMoves } from '../utils/simulateBoard';
import { parseFEN } from '../utils/parseFEN';
import PageHeader from '../components/misc/PageHeader';
import MatchCard from '../components/match/MatchCard';

const STARTING_POSITION_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function MatchHistory() {
    const { id } = useParams();
    const { data: moves = [], isLoading } = useMoves(id!);
    const { data: match } = useMatch(id!);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const initialBoard = useMemo(() => {
        if (!match) return [];
        return parseFEN(STARTING_POSITION_FEN, 'white')!;
    }, [match]);

    const currentBoard = useMemo(() => {
        if (!initialBoard) return [];
        const movesToApply = selectedIndex >= 0 ? moves.slice(0, selectedIndex + 1) : [];
        return applyMoves(initialBoard, movesToApply);
    }, [moves, selectedIndex, initialBoard]);

    if (isLoading || !match) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box px={4} py={6}>
            <PageHeader title="Match history" />
            <Box display="flex" gap={4} flexDirection={{ xs: 'column', md: 'row' }} pt={2}>
                <Box flexShrink={0} flexGrow={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <MatchCard match={match} isStatic />
                    <ChessBoard board={currentBoard} userColor="white" />
                </Box>

                <Box flexGrow={1}>
                    <MoveListPanel moves={moves} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
                </Box>
            </Box>
        </Box>
    );
}
