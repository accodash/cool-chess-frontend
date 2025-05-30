import { render, screen, fireEvent } from '@testing-library/react';
import MoveListPanel from './MoveListPanel';
import { Move } from '../../api/moves';
import * as parseFENModule from '../../utils/parseFEN';
import * as applyMovesModule from '../../utils/simulateBoard';
import * as formatUtils from '../../utils/formatTime';
import * as getSquareCoordsModule from '../../utils/getSquareCoords';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

jest.mock('../../utils/formatTime', () => ({
    formatTime: jest.fn(),
}));

jest.mock('../../utils/getSquareCoords', () => ({
    getSquareCoords: jest.fn(),
}));

jest.mock('../../utils/parseFEN');
jest.mock('../../utils/simulateBoard');

if (typeof global.structuredClone === 'undefined') {
    global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

const renderWithProviders = (ui: React.ReactElement) => {
    const theme = createTheme();
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

const moves: Move[] = [
    { id: '1', from: 'e2', to: 'e4', timeLeft: 120, movedAt: '2023-01-01' },
    { id: '2', from: 'e7', to: 'e5', timeLeft: 115, movedAt: '2023-01-01' },
];

describe('MoveListPanel', () => {
    const mockOnSelect = jest.fn();
    const mockBoard = [
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, 'pawn.png', null, null, null],
        [null, null, null, null, null, null, null, null],
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        (parseFENModule.parseFEN as jest.Mock).mockReturnValue(mockBoard);
        (applyMovesModule.applyMoves as jest.Mock).mockImplementation(() => mockBoard);

        (getSquareCoordsModule.getSquareCoords as jest.Mock).mockImplementation((square: string) => {
            if (square === 'e2') return [6, 4];
            if (square === 'e7') return [1, 4];
            return [0, 0];
        });

        (formatUtils.formatTime as jest.Mock).mockImplementation((time: number) => `${time}s`);
    });

    it('renders all moves with positions and formatted time', () => {
        renderWithProviders(
            <MoveListPanel moves={moves} selectedIndex={-1} onSelect={mockOnSelect} />
        );

        expect(screen.getByText('Moves made')).toBeInTheDocument();
        expect(screen.getByText('e2')).toBeInTheDocument();
        expect(screen.getByText('e4')).toBeInTheDocument();
        expect(screen.getByText('120s')).toBeInTheDocument();
        expect(screen.getByText('e7')).toBeInTheDocument();
        expect(screen.getByText('e5')).toBeInTheDocument();
        expect(screen.getByText('115s')).toBeInTheDocument();
    });

    it('renders piece image for valid board state', () => {
        renderWithProviders(
            <MoveListPanel moves={moves} selectedIndex={0} onSelect={mockOnSelect} />
        );

        const pieceImgs = screen.getAllByRole('img', { name: /piece/i });
        expect(pieceImgs.length).toBeGreaterThan(0);
        expect(pieceImgs[0]).toHaveAttribute('src', 'pawn.png');
    });

    it('calls onSelect with correct index when clicked', () => {
        renderWithProviders(
            <MoveListPanel moves={moves} selectedIndex={0} onSelect={mockOnSelect} />
        );

        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[1]);
        expect(mockOnSelect).toHaveBeenCalledWith(1);
    });

    it('highlights the selected move', () => {
        renderWithProviders(
            <MoveListPanel moves={moves} selectedIndex={1} onSelect={mockOnSelect} />
        );

        const buttons = screen.getAllByRole('button');
        expect(buttons[1]).toHaveClass('Mui-selected');
    });

    it('does not render image if piece is missing on board', () => {
        const emptyBoard = Array(8).fill(null).map(() => Array(8).fill(null));
        (parseFENModule.parseFEN as jest.Mock).mockReturnValue(emptyBoard);
        (applyMovesModule.applyMoves as jest.Mock).mockReturnValue(emptyBoard);

        renderWithProviders(
            <MoveListPanel moves={moves} selectedIndex={0} onSelect={mockOnSelect} />
        );

        const imgs = screen.queryAllByRole('img', { name: /piece/i });
        expect(imgs.length).toBe(0);
    });
});
