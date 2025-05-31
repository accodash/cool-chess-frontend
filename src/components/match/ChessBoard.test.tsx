import { render, screen, fireEvent, act } from '@testing-library/react';
import ChessBoard from './ChessBoard';
import '@testing-library/jest-dom';

function resizeWindow(width: number, height: number) {
    act(() => {
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
        Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
        window.dispatchEvent(new Event('resize'));
    });
}

const board: (string | null)[][] = Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => (row === 1 && col === 0 ? '/pawn.png' : null))
);

describe('ChessBoard', () => {
    beforeEach(() => {
        resizeWindow(1024, 768);
    });

    it('renders 64 squares', () => {
        render(<ChessBoard board={board} userColor="white" />);
        const squares = screen.getAllByRole('img', { hidden: true });
        expect(squares.length).toBe(1);
        expect(screen.getAllByTestId('chess-square')).toHaveLength(64);
    });

    it('renders piece images if provided', () => {
        render(<ChessBoard board={board} userColor="white" />);
        const img = screen.getByRole('img', { hidden: true });
        expect(img).toHaveAttribute('src', '/pawn.png');
    });

    it('calls onSquareClick with correct args', () => {
        const mockClick = jest.fn();
        render(<ChessBoard board={board} userColor="white" onSquareClick={mockClick} />);
        const square = screen.getAllByTestId('chess-square')[8];
        fireEvent.click(square);
        expect(mockClick).toHaveBeenCalledWith(0, 1, '/pawn.png');
    });

    it('does not call onSquareClick if not provided', () => {
        render(<ChessBoard board={board} userColor="white" />);
        const square = screen.getAllByTestId('chess-square')[8];
        fireEvent.click(square);
    });

    it('highlights the correct square', () => {
        const highlighted = new Set(['a7']);
        render(<ChessBoard board={board} userColor="white" highlightedSquares={highlighted} />);
        const square = screen.getAllByTestId('chess-square')[8];
        expect(square).toHaveStyle({ backgroundColor: '#baca44' });
    });

    it('renders flipped board for black', () => {
        const highlighted = new Set(['h2']);
        render(<ChessBoard board={board} userColor="black" highlightedSquares={highlighted} />);
        const square = screen.getAllByTestId('chess-square')[8];
        expect(square).toHaveStyle({ backgroundColor: '#baca44' });
    });

    it('responds to window resizing', () => {
        render(<ChessBoard board={board} userColor="white" />);
        const boardBox = screen.getAllByTestId('chess-square')[0].parentElement;

        expect(boardBox).toHaveStyle(`display: grid`);
        resizeWindow(500, 400);
        render(<ChessBoard board={board} userColor="white" />);
    });
});
