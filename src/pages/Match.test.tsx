import { render, screen, fireEvent } from '@testing-library/react';
import Match from './Match';
import { useMatch } from '../hooks/useMatch';
import { useMatchLogic } from '../hooks/useMatchLogic';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams, useNavigate } from 'react-router-dom';
import { parseFEN } from '../utils/parseFEN';
import '@testing-library/jest-dom';
import { User } from '../api/users';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

jest.mock('../hooks/useMatch', () => ({ useMatch: jest.fn() }));
jest.mock('../hooks/useCurrentUser', () => ({ useCurrentUser: jest.fn() }));
jest.mock('../hooks/useMatchLogic', () => ({ useMatchLogic: jest.fn() }));
jest.mock('../utils/parseFEN', () => ({ parseFEN: jest.fn() }));
jest.mock('@auth0/auth0-react', () => ({ useAuth0: jest.fn() }));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
}));
jest.mock('../components/misc/PageHeader', () => () => <div>Mock PageHeader</div>);
jest.mock('../components/match/ChessBoard', () => {
    return ({
        onSquareClick,
    }: {
        onSquareClick: (colIndex: number, rowIndex: number, piece: string | null) => void;
    }) => (
        <div>
            Mock ChessBoard
            <button onClick={() => onSquareClick(4, 6, 'p-w')}>Click Pawn</button>
            <button onClick={() => onSquareClick(4, 4, null)}>Click Empty</button>
        </div>
    );
});
jest.mock('../components/match/PlayerInfo', () => {
    return ({ player, color }: { player: User; color: string }) => (
        <div>
            Mock PlayerInfo: {player.username} ({color})
        </div>
    );
});
jest.mock('@tanstack/react-query', () => {
    const originalModule = jest.requireActual('@tanstack/react-query');
    return {
        ...originalModule,
        useQueryClient: jest.fn(),
    };
});

const renderWithProviders = () => {
    render(
        <QueryClientProvider client={createTestQueryClient()}>
            <Match />
        </QueryClientProvider>
    );
};

describe('Match Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useParams as jest.Mock).mockReturnValue({ id: 'match123' });

        (useAuth0 as jest.Mock).mockReturnValue({ isLoading: false });
        (useCurrentUser as jest.Mock).mockReturnValue({
            data: { uuid: 'user1' },
            isLoading: false,
        });

        (useMatchLogic as jest.Mock).mockReturnValue({
            enterMatch: jest.fn(),
            emitMove: jest.fn(),
            possibleMoves: {
                e2: [{ to: 'e4' }],
            },
        });

        (useMatch as jest.Mock).mockReturnValue({
            data: {
                blackPlayer: { uuid: 'user2', username: 'Black', createdAt: '2023-01-01', imageUrl: 'ryszard.png' },
                whitePlayer: { uuid: 'user1', username: 'White', createdAt: '2023-01-01', imageUrl: 'essa.png' },
                boardState: { board: 'some-fen', remainingBlackTime: 30, remainingWhiteTime: 60 },
            },
            isLoading: false,
        });

        (parseFEN as jest.Mock).mockReturnValue([['r', 'n'], [], [], [], [], [], [], []]);
    });

    it('redirects to / if user not logged in', () => {
        (useCurrentUser as jest.Mock).mockReturnValue({ data: null, isLoading: false });
        (useMatch as jest.Mock).mockReturnValue({ data: {}, isLoading: false });

        renderWithProviders();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('redirects to /play if no id', () => {
        (useParams as jest.Mock).mockReturnValue({ id: undefined });
        (useMatch as jest.Mock).mockReturnValue({ data: {}, isLoading: false });
        renderWithProviders();
        expect(mockNavigate).toHaveBeenCalledWith('/play');
    });

    it('shows loading if match is loading', () => {
        (useMatch as jest.Mock).mockReturnValue({ isLoading: true });
        renderWithProviders();
        expect(screen.getByText('Loading match...')).toBeInTheDocument();
    });

    it('shows error if match is error or null', () => {
        (useMatch as jest.Mock).mockReturnValue({ isError: true, data: null });
        renderWithProviders();
        expect(screen.getByText('Error loading match')).toBeInTheDocument();
    });

    it('renders match board and player info', () => {
        renderWithProviders();
        expect(screen.getByText('Mock PageHeader')).toBeInTheDocument();
        expect(screen.getByText('Mock PlayerInfo: Black (black)')).toBeInTheDocument();
        expect(screen.getByText('Mock PlayerInfo: White (white)')).toBeInTheDocument();
        expect(screen.getByText('Mock ChessBoard')).toBeInTheDocument();
    });

    it('shows game over dialog and handles navigation', async () => {
        const emitMoveMock = jest.fn();

        (useAuth0 as jest.Mock).mockReturnValue({ isLoading: false });
        (useCurrentUser as jest.Mock).mockReturnValue({ data: { uuid: 'user1' }, isLoading: false });
        (useParams as jest.Mock).mockReturnValue({ id: 'match123' });

        (useMatchLogic as jest.Mock).mockImplementation((_id, _uuid, _invalidate, setResult) => {
            setTimeout(() => {
                setResult('win');
            }, 0);
            return { enterMatch: jest.fn(), emitMove: emitMoveMock, possibleMoves: {} };
        });

        renderWithProviders();

        expect(await screen.findByText(/you won!/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText('Back to Play'));
        expect(mockNavigate).toHaveBeenCalledWith('/play');

        fireEvent.click(screen.getByText('Close'));
        expect(screen.queryByText(/you won!/i)).not.toBeInTheDocument();
    });

    it('handles incorrect square click for black player', () => {
        const emitMoveMock = jest.fn();

        (useMatchLogic as jest.Mock).mockReturnValue({
            enterMatch: jest.fn(),
            emitMove: emitMoveMock,
            possibleMoves: { e2: [{ to: 'e4' }] },
        });

        (useCurrentUser as jest.Mock).mockReturnValue({
            data: { uuid: 'user2' },
            isLoading: false,
        });

        renderWithProviders();

        fireEvent.click(screen.getByText('Click Pawn'));
        fireEvent.click(screen.getByText('Click Pawn'));

        expect(emitMoveMock).not.toHaveBeenCalled();
    });

    it('handles incorrect square click for white player', () => {
        const emitMoveMock = jest.fn();
        const moves = { e2: [{ to: 'e4' }] };

        (useMatchLogic as jest.Mock).mockReturnValue({
            enterMatch: jest.fn(),
            emitMove: emitMoveMock,
            possibleMoves: moves,
        });

        renderWithProviders();

        fireEvent.click(screen.getByText('Click Pawn'));
        fireEvent.click(screen.getByText('Click Pawn'));

        expect(emitMoveMock).not.toHaveBeenCalled();
    });

    it('shows game over dialog for loss result', async () => {
        (useMatchLogic as jest.Mock).mockImplementation((_id, _uuid, _invalidate, setResult) => {
            setTimeout(() => setResult('loss'), 0);
            return { enterMatch: jest.fn(), emitMove: jest.fn(), possibleMoves: {} };
        });

        renderWithProviders();

        expect(await screen.findByText(/you lost!/i)).toBeInTheDocument();
    });

    it('shows game over dialog for draw result', async () => {
        (useMatchLogic as jest.Mock).mockImplementation((_id, _uuid, _invalidate, setResult) => {
            setTimeout(() => setResult('draw'), 0);
            return { enterMatch: jest.fn(), emitMove: jest.fn(), possibleMoves: {} };
        });

        renderWithProviders();

        expect(await screen.findByText(/it's a draw!/i)).toBeInTheDocument();
    });

    it('closes the game over dialog when dialog is closed without a button', async () => {
        (useMatchLogic as jest.Mock).mockImplementation((_id, _uuid, _invalidate, setResult) => {
            setTimeout(() => setResult('loss'), 0);
            return { enterMatch: jest.fn(), emitMove: jest.fn(), possibleMoves: {} };
        });

        renderWithProviders();

        expect(await screen.findByText(/you lost!/i)).toBeInTheDocument();
        const backdrop = document.querySelector('.MuiBackdrop-root');
        if (backdrop) {
            fireEvent.click(backdrop);
        }
        expect(screen.queryByText(/you lost!/i)).not.toBeInTheDocument();
    });

    it('emits a move on valid square click', () => {
        const emitMoveMock = jest.fn();

        (useMatchLogic as jest.Mock).mockReturnValue({
            enterMatch: jest.fn(),
            emitMove: emitMoveMock,
            possibleMoves: {
                e2: [{ to: 'e4' }],
            },
        });

        renderWithProviders();

        fireEvent.click(screen.getByText('Click Pawn'));
        fireEvent.click(screen.getByText('Click Empty'));

        expect(emitMoveMock).toHaveBeenCalledWith('e2', 'e4');
    });

    it('does not call emitMove when no possible moves for selected piece', () => {
        const emitMoveMock = jest.fn();

        (useMatchLogic as jest.Mock).mockReturnValue({
            enterMatch: jest.fn(),
            emitMove: emitMoveMock,
            possibleMoves: {},
        });

        renderWithProviders();

        fireEvent.click(screen.getByText('Click Pawn'));
        fireEvent.click(screen.getByText('Click Empty'));

        expect(emitMoveMock).not.toHaveBeenCalled();
    });

    it('calls invalidateQueries when match logic triggers it', () => {
        const invalidateQueriesMock = jest.fn();

        const queryClientMock = {
            invalidateQueries: invalidateQueriesMock,
        };
        (useQueryClient as jest.Mock).mockReturnValue(queryClientMock);

        (useMatchLogic as jest.Mock).mockImplementation((_id, _uuid, invalidate) => {
            invalidate();
            return {
                enterMatch: jest.fn(),
                emitMove: jest.fn(),
                possibleMoves: {},
            };
        });

        renderWithProviders();
        expect(invalidateQueriesMock).toHaveBeenCalled();
    });

    it('sets user color to white when current user is the black player', () => {
        (useCurrentUser as jest.Mock).mockReturnValue({
            data: { uuid: 'user2' },
            isLoading: false,
        });

        renderWithProviders();

        expect(screen.getByText('Mock PlayerInfo: Black (black)')).toBeInTheDocument();
        expect(screen.getByText('Mock PlayerInfo: White (white)')).toBeInTheDocument();
    });
});
