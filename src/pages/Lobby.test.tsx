import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Lobby from './Lobby';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useMatchmaking } from '../hooks/useMatchmaking';
import { useNavigate } from 'react-router-dom';

jest.mock('../hooks/useCurrentUser', () => ({
    useCurrentUser: jest.fn(),
}));

jest.mock('../hooks/useMatchmaking', () => ({
    useMatchmaking: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('../components/misc/PageHeader', () => () => <div>Mock PageHeader</div>);
jest.mock('../components/misc/LoginRequiredNotice', () => () => <div>Mock LoginRequiredNotice</div>);

const mockedUseCurrentUser = useCurrentUser as jest.Mock;
const mockedUseMatchmaking = useMatchmaking as jest.Mock;
const mockedUseNavigate = useNavigate as jest.Mock;

describe('Lobby Component', () => {
    const mockNavigate = jest.fn();
    const mockStartMatchmaking = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseNavigate.mockReturnValue(mockNavigate);
        mockedUseMatchmaking.mockReturnValue({ startMatchmaking: mockStartMatchmaking });
    });

    it('renders login required notice if not logged in', () => {
        mockedUseCurrentUser.mockReturnValue({ data: null });
        render(<Lobby />);

        expect(screen.getByText('Mock PageHeader')).toBeInTheDocument();
        expect(screen.getByText('Mock LoginRequiredNotice')).toBeInTheDocument();
    });

    it('renders game lobby UI when user is logged in', () => {
        mockedUseCurrentUser.mockReturnValue({
            data: { uuid: 'user123' },
        });

        render(<Lobby />);

        expect(screen.getByText('Mock PageHeader')).toBeInTheDocument();
        expect(screen.getByText('Find a game')).toBeInTheDocument();
        expect(screen.getByLabelText('Gamemode')).toBeInTheDocument();
        expect(screen.getByLabelText('Ranked?')).toBeInTheDocument();
    });

    it('starts matchmaking when Find a game is clicked', () => {
        mockedUseCurrentUser.mockReturnValue({
            data: { uuid: 'user123' },
        });

        render(<Lobby />);

        fireEvent.click(screen.getByText('Find a game'));

        expect(mockStartMatchmaking).toHaveBeenCalledWith('user123', 'rapid', false);
        expect(screen.getByText(/matchmaking is in progress/i)).toBeInTheDocument();
    });

    it('updates gamemode when user selects a different one', () => {
        mockedUseCurrentUser.mockReturnValue({
            data: { uuid: 'user123' },
        });

        render(<Lobby />);
        const clickable = document.querySelector('.MuiSelect-select') as HTMLElement;
        const select = document.querySelector('.MuiSelect-nativeInput') as HTMLInputElement;

        fireEvent.mouseDown(clickable);
        fireEvent.click(screen.getByText('Bullet'));
        expect(select.value).toBe('Bullet');
    });

    it('toggles ranked checkbox', () => {
        mockedUseCurrentUser.mockReturnValue({
            data: { uuid: 'user123' },
        });

        render(<Lobby />);
        const checkbox = screen.getByLabelText('Ranked?') as HTMLInputElement;
        expect(checkbox.checked).toBe(false);

        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);
    });

    it('does not call matchmaking if user has no uuid', () => {
        mockedUseCurrentUser.mockReturnValue({
            data: { uuid: null },
        });

        render(<Lobby />);
        fireEvent.click(screen.getByText('Find a game'));

        expect(mockStartMatchmaking).not.toHaveBeenCalled();
    });

    it('navigates to match page when matchmaking callback is triggered', () => {
        mockedUseCurrentUser.mockReturnValue({
            data: { uuid: 'user123' },
        });

        let capturedCallback: (matchData: any) => void;

        mockedUseMatchmaking.mockImplementation((cb) => {
            capturedCallback = cb;
            return { startMatchmaking: mockStartMatchmaking };
        });

        render(<Lobby />);
        fireEvent.click(screen.getByText('Find a game'));

        capturedCallback!({ gameId: 'match789' });

        expect(mockNavigate).toHaveBeenCalledWith('/match/match789');
    });
});
