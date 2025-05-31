import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MatchHistory from './MatchHistory';
import { useParams } from 'react-router-dom';
import { useMatch } from '../hooks/useMatch';
import { useMoves } from '../hooks/useMoves';
import { parseFEN } from '../utils/parseFEN';
import { applyMoves } from '../utils/simulateBoard';

jest.mock('../hooks/useMatch', () => ({
    useMatch: jest.fn(),
}));

jest.mock('../hooks/useMoves', () => ({
    useMoves: jest.fn(),
}));

jest.mock('../utils/parseFEN', () => ({
    parseFEN: jest.fn(),
}));

jest.mock('../utils/simulateBoard', () => ({
    applyMoves: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

jest.mock('../components/misc/PageHeader', () => () => <div>Mock PageHeader</div>);
jest.mock('../components/match/MatchCard', () => ({ match }: any) => <div>Mock MatchCard: {match.id}</div>);
jest.mock('../components/match/ChessBoard', () => ({ board }: any) => (
    <div>Mock ChessBoard: {JSON.stringify(board)}</div>
));
jest.mock('../components/match/MoveListPanel', () => ({ moves, selectedIndex, onSelect }: any) => (
    <div>
        Mock MoveListPanel
        {moves.map((move: any, idx: number) => (
            <button key={idx} onClick={() => onSelect(idx)}>
                Move {move.id} {selectedIndex === idx ? '(selected)' : ''}
            </button>
        ))}
    </div>
));

const mockedUseMatch = useMatch as jest.Mock;
const mockedUseMoves = useMoves as jest.Mock;
const mockedUseParams = useParams as jest.Mock;
const mockedParseFEN = parseFEN as jest.Mock;
const mockedApplyMoves = applyMoves as jest.Mock;

describe('MatchHistory Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseParams.mockReturnValue({ id: 'match123' });
    });

    it('renders loading state when isLoading is true or match is undefined', () => {
        mockedUseMatch.mockReturnValue({ data: null });
        mockedUseMoves.mockReturnValue({ data: [], isLoading: true });

        render(<MatchHistory />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders match info, chessboard, and move list when data is available', () => {
        const mockMoves = [{ id: 'm1', from: 'e2', to: 'e4' }];
        const mockMatch = { id: 'match123' };
        const mockBoard = [['r', 'n'], [], [], [], [], [], [], []];

        mockedUseMatch.mockReturnValue({ data: mockMatch });
        mockedUseMoves.mockReturnValue({ data: mockMoves, isLoading: false });
        mockedParseFEN.mockReturnValue(mockBoard);
        mockedApplyMoves.mockReturnValue(mockBoard);

        render(<MatchHistory />);

        expect(screen.getByText('Mock PageHeader')).toBeInTheDocument();
        expect(screen.getByText('Mock MatchCard: match123')).toBeInTheDocument();
        expect(screen.getByText(/Mock ChessBoard/)).toBeInTheDocument();
        expect(screen.getByText('Mock MoveListPanel')).toBeInTheDocument();
    });

    it('updates selectedIndex when a move is clicked', () => {
        const mockMoves = [
            { id: 'm1', from: 'e2', to: 'e4' },
            { id: 'm2', from: 'e7', to: 'e5' },
        ];
        const mockMatch = { id: 'match456' };
        const mockBoard = [['r', 'n'], [], [], [], [], [], [], []];

        mockedUseMatch.mockReturnValue({ data: mockMatch });
        mockedUseMoves.mockReturnValue({ data: mockMoves, isLoading: false });
        mockedParseFEN.mockReturnValue(mockBoard);
        mockedApplyMoves.mockReturnValue(mockBoard);

        render(<MatchHistory />);

        const moveBtn = screen.getByText('Move m2');
        fireEvent.click(moveBtn);

        expect(screen.getByText('Move m2 (selected)')).toBeInTheDocument();
    });

    it('renders properly when useMoves returns undefined data', () => {
        const mockMatch = { id: 'match789' };
        const mockBoard = [['r', 'n'], [], [], [], [], [], [], []];

        mockedUseMatch.mockReturnValue({ data: mockMatch });
        mockedUseMoves.mockReturnValue({ data: undefined, isLoading: false }); // <-- undefined moves
        mockedParseFEN.mockReturnValue(mockBoard);
        mockedApplyMoves.mockReturnValue(mockBoard);

        render(<MatchHistory />);

        expect(screen.getByText('Mock PageHeader')).toBeInTheDocument();
        expect(screen.getByText('Mock MatchCard: match789')).toBeInTheDocument();
        expect(screen.getByText(/Mock ChessBoard/)).toBeInTheDocument();
        expect(screen.getByText('Mock MoveListPanel')).toBeInTheDocument();
    });

    it('renders empty board if initialBoard is null', () => {
        const mockMatch = { id: 'match000' };

        mockedUseMatch.mockReturnValue({ data: mockMatch });
        mockedUseMoves.mockReturnValue({ data: [], isLoading: false });
        mockedParseFEN.mockReturnValue(undefined);
        mockedApplyMoves.mockReturnValue([]);

        render(<MatchHistory />);

        expect(screen.getByText('Mock PageHeader')).toBeInTheDocument();
        expect(screen.getByText('Mock MatchCard: match000')).toBeInTheDocument();
        expect(screen.getByText('Mock ChessBoard: []')).toBeInTheDocument();
        expect(screen.getByText('Mock MoveListPanel')).toBeInTheDocument();
    });
});
