import { render, screen, fireEvent } from '@testing-library/react';
import MatchCard from './MatchCard';
import { Match } from '../../api/match';
import { BrowserRouter } from 'react-router-dom';
import * as userHook from '../../hooks/useCurrentUser';
import * as mui from '@mui/material';
import '@testing-library/jest-dom';

jest.mock('@mui/material', () => {
    const actual = jest.requireActual('@mui/material');
    return {
        ...actual,
        useMediaQuery: jest.fn(),
        useTheme: () => ({
            breakpoints: {
                down: () => '(max-width:600px)',
            },
        }),
    };
});

jest.mock('../../hooks/useCurrentUser', () => ({
    useCurrentUser: jest.fn(),
}));

const mockUser = {
    uuid: 'user-1',
    username: 'Alice',
    createdAt: '',
    imageUrl: null,
};

const defaultMatch: Match = {
    id: 'match-123',
    mode: 'bullet',
    startAt: new Date('2024-05-01T12:00:00Z').toISOString(),
    isCompleted: true,
    winner: { uuid: 'user-1', username: 'Alice', createdAt: '', imageUrl: null },
    isRanked: true,
    whitePlayer: { uuid: 'user-1', username: 'Alice', createdAt: '', imageUrl: null },
    blackPlayer: { uuid: 'user-2', username: 'Bob', createdAt: '', imageUrl: null },
    moves: [],
    boardState: {
        board: 'rnbqkbnr/p1pp1ppp/8/1p2p2P/8/8/PPPPPPP1/RNBQKBNR w KQkq - 0 3',
        turn: 'white',
        remainingBlackTime: 600,
        remainingWhiteTime: 600,
    },
};

const renderCard = (props = {}, isMobile = false) => {
    (mui.useMediaQuery as jest.Mock).mockReturnValue(isMobile);
    (userHook.useCurrentUser as jest.Mock).mockReturnValue({ data: mockUser });

    return render(
        <BrowserRouter>
            <MatchCard match={{ ...defaultMatch, ...props }} />
        </BrowserRouter>
    );
};

describe('MatchCard', () => {
    it('renders match info with result WON', () => {
        renderCard();

        expect(screen.getByText(/Alice vs Bob/i)).toBeInTheDocument();
        expect(screen.getByText('Bullet')).toBeInTheDocument();
        expect(screen.getByText('Ranked')).toBeInTheDocument();
        expect(screen.getByText('WON')).toBeInTheDocument();
    });

    it('renders with result LOST', () => {
        renderCard({ winner: { uuid: 'user-2', username: 'Bob' } });

        expect(screen.getByText('LOST')).toBeInTheDocument();
    });

    it('renders with result DRAW', () => {
        renderCard({ winner: null });

        expect(screen.getByText('DRAW')).toBeInTheDocument();
    });

    it('renders ongoing match with Rejoin button', () => {
        renderCard({ isCompleted: false });

        expect(screen.getByText('ONGOING')).toBeInTheDocument();
        expect(screen.getByText('Rejoin')).toBeInTheDocument();
    });

    it('prevents Rejoin button propagation', () => {
        renderCard({ isCompleted: false });

        const button = screen.getByText('Rejoin');


        const preventDefaultSpy = jest.spyOn(Event.prototype, 'preventDefault');
        const stopPropagationSpy = jest.spyOn(Event.prototype, 'stopPropagation');

        fireEvent.click(button);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();

        preventDefaultSpy.mockRestore();
        stopPropagationSpy.mockRestore();
    });

    it('renders in static mode', () => {
        render(
            <BrowserRouter>
                <MatchCard match={defaultMatch} isStatic />
            </BrowserRouter>
        );

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(screen.getByText('WON')).toBeInTheDocument();
    });

    it('renders correctly in mobile view', () => {
        renderCard({}, true);

        const wrapper = screen.getByText(/Alice vs Bob/i).closest('div');
        expect(wrapper?.parentElement).toHaveStyle('flex-direction: column');
    });

    it('renders fallback mode label if unknown', () => {
        renderCard({ mode: 'hyper' });

        expect(screen.getByText('hyper')).toBeInTheDocument();
    });

    it('renders Unranked match', () => {
        renderCard({ isRanked: false });

        expect(screen.getByText('Unranked')).toBeInTheDocument();
    });
});
