import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FriendActionButtons from './FriendActionButtons';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useFriends } from '../../hooks/useFriends';
import { useReceivedFriendRequests } from '../../hooks/useReceivedFriendRequests';
import { useSentFriendRequests } from '../../hooks/useSentFriendRequests';
import { useSendFriendRequest } from '../../hooks/useSendFriendRequest';
import { useAcceptFriendRequest } from '../../hooks/useAcceptFriendRequest';
import { useRemoveFriend } from '../../hooks/useRemoveFriend';

jest.mock('../../hooks/useCurrentUser', () => ({
    useCurrentUser: jest.fn(),
}));

jest.mock('../../hooks/useFriends', () => ({
    useFriends: jest.fn(),
}));

jest.mock('../../hooks/useReceivedFriendRequests', () => ({
    useReceivedFriendRequests: jest.fn(),
}));

jest.mock('../../hooks/useSentFriendRequests', () => ({
    useSentFriendRequests: jest.fn(),
}));

jest.mock('../../hooks/useSendFriendRequest', () => ({
    useSendFriendRequest: jest.fn(),
}));

jest.mock('../../hooks/useAcceptFriendRequest', () => ({
    useAcceptFriendRequest: jest.fn(),
}));

jest.mock('../../hooks/useRemoveFriend', () => ({
    useRemoveFriend: jest.fn(),
}));

jest.mock('../misc/ConfirmDialog', () => (props: any) => {
    if (!props.open) return null;

    return (
        <div data-testid="confirm-dialog" style={{ display: props.open ? 'block' : 'none' }}>
            <div>{props.title}</div>
            <div>{props.content}</div>
            <button onClick={props.onConfirm} aria-label="confirm">
                Confirm
            </button>
            <button onClick={props.onClose} aria-label="cancel">
                Cancel
            </button>
        </div>
    );
});

describe('FriendActionButtons', () => {
    const currentUser = { uuid: 'current-user' };
    const targetUserId = 'target-user';

    const mockSendRequest = { mutate: jest.fn() };
    const mockAcceptRequest = { mutate: jest.fn() };
    const mockRemoveFriend = { mutate: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();

        (useCurrentUser as jest.Mock).mockReturnValue({ data: currentUser });
        (useSendFriendRequest as jest.Mock).mockReturnValue(mockSendRequest);
        (useAcceptFriendRequest as jest.Mock).mockReturnValue(mockAcceptRequest);
        (useRemoveFriend as jest.Mock).mockReturnValue(mockRemoveFriend);

        (useFriends as jest.Mock).mockReturnValue({ data: [] });
        (useReceivedFriendRequests as jest.Mock).mockReturnValue({ data: [] });
        (useSentFriendRequests as jest.Mock).mockReturnValue({ data: [] });
    });

    it('renders nothing if currentUser is null', () => {
        (useCurrentUser as jest.Mock).mockReturnValue({ data: null });
        const { container } = render(<FriendActionButtons userId={targetUserId} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing if currentUser is target user', () => {
        (useCurrentUser as jest.Mock).mockReturnValue({ data: { uuid: targetUserId } });
        const { container } = render(<FriendActionButtons userId={targetUserId} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('shows Remove friend button and confirm dialog flow', async () => {
        (useFriends as jest.Mock).mockReturnValue({
            data: [
                {
                    id: 'friend-rel-id',
                    firstUser: { uuid: targetUserId },
                    secondUser: { uuid: 'other-user' },
                    befriendedAt: '2023-01-01',
                },
            ],
        });

        render(<FriendActionButtons userId={targetUserId} />);

        const removeBtn = screen.getByRole('button', { name: /remove friend/i });
        expect(removeBtn).toBeInTheDocument();

        fireEvent.click(removeBtn);
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

        await waitFor(() => {
            expect(mockRemoveFriend.mutate).toHaveBeenCalledWith('friend-rel-id');
        });

        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
        expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
    });

    it('shows Accept and Reject friend request buttons and handle clicks', () => {
        (useReceivedFriendRequests as jest.Mock).mockReturnValue({
            data: [
                {
                    id: 'received-id',
                    firstUser: { uuid: targetUserId },
                    befriendedAt: null,
                },
            ],
        });

        render(<FriendActionButtons userId={targetUserId} />);

        const acceptBtn = screen.getByRole('button', { name: /accept friend request/i });
        const rejectBtn = screen.getByRole('button', { name: /reject friend request/i });

        expect(acceptBtn).toBeInTheDocument();
        expect(rejectBtn).toBeInTheDocument();

        fireEvent.click(acceptBtn);
        expect(mockAcceptRequest.mutate).toHaveBeenCalledWith('received-id');

        fireEvent.click(rejectBtn);
        expect(mockRemoveFriend.mutate).toHaveBeenCalledWith('received-id');
    });

    it('shows Cancel friend request button and handles click', () => {
        (useSentFriendRequests as jest.Mock).mockReturnValue({
            data: [
                {
                    id: 'sent-id',
                    secondUser: { uuid: targetUserId },
                    befriendedAt: null,
                },
            ],
        });

        render(<FriendActionButtons userId={targetUserId} />);

        const cancelBtn = screen.getByRole('button', { name: /cancel friend request/i });
        expect(cancelBtn).toBeInTheDocument();

        fireEvent.click(cancelBtn);
        expect(mockRemoveFriend.mutate).toHaveBeenCalledWith('sent-id');
    });

    it('shows Add friend button and handles click', () => {
        render(<FriendActionButtons userId={targetUserId} />);

        const addBtn = screen.getByRole('button', { name: /add friend/i });
        expect(addBtn).toBeInTheDocument();

        fireEvent.click(addBtn);
        expect(mockSendRequest.mutate).toHaveBeenCalledWith(targetUserId);
    });

    it('handles null or undefined data gracefully', () => {
        (useFriends as jest.Mock).mockReturnValue({ data: null });
        (useReceivedFriendRequests as jest.Mock).mockReturnValue({ data: undefined });
        (useSentFriendRequests as jest.Mock).mockReturnValue({ data: null });

        render(<FriendActionButtons userId={targetUserId} />);

        expect(screen.getByRole('button', { name: /add friend/i })).toBeInTheDocument();
    });

    it('displays correct buttons when user is secondUser', async () => {
        (useFriends as jest.Mock).mockReturnValue({
            data: [
                {
                    id: 'friend-rel-id-2',
                    firstUser: { uuid: 'other-user' },
                    secondUser: { uuid: targetUserId },
                    befriendedAt: '2023-01-01',
                },
            ],
        });

        render(<FriendActionButtons userId={targetUserId} />);

        const removeBtn = screen.getByRole('button', { name: /remove friend/i });
        expect(removeBtn).toBeInTheDocument();

        fireEvent.click(removeBtn);
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

        await waitFor(() => {
            expect(mockRemoveFriend.mutate).toHaveBeenCalledWith('friend-rel-id-2');
        });

        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
        expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
    });
});
