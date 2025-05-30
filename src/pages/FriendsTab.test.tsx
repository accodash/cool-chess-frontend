import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FriendsTab from './FriendsTab';
import { useFriends } from '../hooks/useFriends';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useRemoveFriend } from '../hooks/useRemoveFriend';

jest.mock('../components/social/UserCard', () => (props: any) => (
    <div data-testid="user-card">
        <span>{props.username}</span>
        {props.action}
    </div>
));

jest.mock('../components/misc/ConfirmDialog', () => (props: any) => {
    return props.open ? (
        <div data-testid="confirm-dialog">
            <p>{props.content}</p>
            <button onClick={props.onConfirm}>Confirm</button>
            <button onClick={props.onClose}>Cancel</button>
        </div>
    ) : null;
});

jest.mock('../hooks/useCurrentUser', () => ({
    useCurrentUser: jest.fn(),
}));

jest.mock('../hooks/useRemoveFriend', () => ({
    useRemoveFriend: jest.fn(),
}));

jest.mock('../hooks/useFriends', () => ({
    useFriends: jest.fn(),
}));

const mockedUseFriends = useFriends as jest.Mock;
const mockedUseRemoveFriend = useRemoveFriend as jest.Mock;
const mockedUseCurrentUser = useCurrentUser as jest.Mock;

describe('FriendsTab', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseCurrentUser.mockReturnValue({ data: null });
    });

    it('renders loading state', () => {
        mockedUseFriends.mockReturnValue({ data: null, isLoading: true });
        render(<FriendsTab />);
        expect(screen.getByText(/loading friends/i)).toBeInTheDocument();
    });

    it('renders empty state', () => {
        mockedUseFriends.mockReturnValue({ data: [], isLoading: false });
        render(<FriendsTab />);
        expect(screen.getByText(/no friends yet/i)).toBeInTheDocument();
    });

    it('renders list of friends with correct user shown', () => {
        mockedUseCurrentUser.mockReturnValue({ data: { uuid: 'me' } });
        mockedUseRemoveFriend.mockReturnValue({ mutate: jest.fn() });
        mockedUseFriends.mockReturnValue({
            data: [
                {
                    id: '1',
                    firstUser: { uuid: 'me', username: 'Me', createdAt: '', imageUrl: '' },
                    secondUser: { uuid: 'you', username: 'You', createdAt: '', imageUrl: '' },
                },
            ],
            isLoading: false,
        });

        render(<FriendsTab />);
        expect(screen.getByText('You')).toBeInTheDocument();
        expect(screen.getByText(/remove friend/i)).toBeInTheDocument();
    });

    it('opens confirm dialog and removes friend', () => {
        const mutateMock = jest.fn();
        mockedUseCurrentUser.mockReturnValue({ data: { uuid: 'me' } });
        mockedUseRemoveFriend.mockReturnValue({ mutate: mutateMock });
        mockedUseFriends.mockReturnValue({
            data: [
                {
                    id: '1',
                    firstUser: { uuid: 'me', username: 'Me', createdAt: '', imageUrl: '' },
                    secondUser: { uuid: 'you', username: 'You', createdAt: '', imageUrl: '' },
                },
            ],
            isLoading: false,
        });

        render(<FriendsTab />);

        fireEvent.click(screen.getByText(/remove friend/i));
        expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText('Confirm'));
        expect(mutateMock).toHaveBeenCalledWith('1');
    });

    it('cancels confirm dialog without removing', () => {
        const mutateMock = jest.fn();
        mockedUseCurrentUser.mockReturnValue({ data: { uuid: 'me' } });
        mockedUseRemoveFriend.mockReturnValue({ mutate: mutateMock });
        mockedUseFriends.mockReturnValue({
            data: [
                {
                    id: '1',
                    firstUser: { uuid: 'me', username: 'Me', createdAt: '', imageUrl: '' },
                    secondUser: { uuid: 'you', username: 'You', createdAt: '', imageUrl: '' },
                },
            ],
            isLoading: false,
        });

        render(<FriendsTab />);

        fireEvent.click(screen.getByText(/remove friend/i));
        expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Cancel'));
        expect(mutateMock).not.toHaveBeenCalled();
    });

    it('renders nothing if currentUser is null', () => {
        mockedUseCurrentUser.mockReturnValue({ data: null });
        mockedUseFriends.mockReturnValue({
            data: [
                {
                    id: '1',
                    firstUser: { uuid: 'user1', username: 'User 1', createdAt: '', imageUrl: '' },
                    secondUser: { uuid: 'user2', username: 'User 2', createdAt: '', imageUrl: '' },
                },
            ],
            isLoading: false,
        });

        const { container } = render(<FriendsTab />);
        expect(container.querySelectorAll('[data-testid="user-card"]').length).toBe(0);
    });

    it('renders friend with firstUser as the displayed user when firstUser.uuid !== currentUser.uuid', () => {
        mockedUseCurrentUser.mockReturnValue({ data: { uuid: 'otherUser' } });
        mockedUseRemoveFriend.mockReturnValue({ mutate: jest.fn() });
        mockedUseFriends.mockReturnValue({
            data: [
                {
                    id: '1',
                    firstUser: { uuid: 'friend1', username: 'Friend 1', createdAt: '', imageUrl: '' },
                    secondUser: { uuid: 'otherUser', username: 'Current User', createdAt: '', imageUrl: '' },
                },
            ],
            isLoading: false,
        });

        render(<FriendsTab />);
        expect(screen.getByText('Friend 1')).toBeInTheDocument();
    });
});
