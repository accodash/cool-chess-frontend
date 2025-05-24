import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReceivedRequestsTab from './ReceivedRequestsTab';
import { useReceivedFriendRequests } from '../hooks/useReceivedFriendRequests';
import { useAcceptFriendRequest } from '../hooks/useAcceptFriendRequest';
import { useRemoveFriend } from '../hooks/useRemoveFriend';

jest.mock('../hooks/useReceivedFriendRequests', () => ({
    useReceivedFriendRequests: jest.fn(),
}));

jest.mock('../hooks/useAcceptFriendRequest', () => ({
    useAcceptFriendRequest: jest.fn(),
}));

jest.mock('../hooks/useRemoveFriend', () => ({
    useRemoveFriend: jest.fn(),
}));

jest.mock('../components/social/UserCard', () => (props: any) => (
    <div data-testid="user-card">
        <div>{props.username}</div>
        {props.action}
    </div>
));

describe('ReceivedRequestsTab', () => {
    const mockAccept = jest.fn();
    const mockRemove = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAcceptFriendRequest as jest.Mock).mockReturnValue({ mutate: mockAccept });
        (useRemoveFriend as jest.Mock).mockReturnValue({ mutate: mockRemove });
    });

    it('displays loading state', () => {
        (useReceivedFriendRequests as jest.Mock).mockReturnValue({
            isLoading: true,
            data: [],
        });

        render(<ReceivedRequestsTab />);
        expect(screen.getByText(/loading received requests/i)).toBeInTheDocument();
    });

    it('displays message when no requests', () => {
        (useReceivedFriendRequests as jest.Mock).mockReturnValue({
            isLoading: false,
            data: [],
        });

        render(<ReceivedRequestsTab />);
        expect(screen.getByText(/no received friend requests/i)).toBeInTheDocument();
    });

    it('renders user cards for received requests', () => {
        (useReceivedFriendRequests as jest.Mock).mockReturnValue({
            isLoading: false,
            data: [
                {
                    id: 'req-1',
                    firstUser: {
                        uuid: 'u1',
                        username: 'RequestSender',
                        imageUrl: 'img.jpg',
                        createdAt: '2024-01-01',
                    },
                },
            ],
        });

        render(<ReceivedRequestsTab />);
        expect(screen.getByTestId('user-card')).toHaveTextContent('RequestSender');
        expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /reject/i })).toBeInTheDocument();
    });

    it('handles accept request action', () => {
        (useReceivedFriendRequests as jest.Mock).mockReturnValue({
            isLoading: false,
            data: [
                {
                    id: 'req-1',
                    firstUser: {
                        uuid: 'u1',
                        username: 'UserOne',
                        imageUrl: 'img1.jpg',
                        createdAt: '2023-10-01',
                    },
                },
            ],
        });

        render(<ReceivedRequestsTab />);
        fireEvent.click(screen.getByRole('button', { name: /accept/i }));
        expect(mockAccept).toHaveBeenCalledWith('req-1');
    });

    it('handles reject request action', () => {
        (useReceivedFriendRequests as jest.Mock).mockReturnValue({
            isLoading: false,
            data: [
                {
                    id: 'req-1',
                    firstUser: {
                        uuid: 'u1',
                        username: 'UserOne',
                        imageUrl: 'img1.jpg',
                        createdAt: '2023-10-01',
                    },
                },
            ],
        });

        render(<ReceivedRequestsTab />);
        fireEvent.click(screen.getByRole('button', { name: /reject/i }));
        expect(mockRemove).toHaveBeenCalledWith('req-1');
    });
});
