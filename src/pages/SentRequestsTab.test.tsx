import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SentRequestsTab from './SentRequestsTab';
import { useSentFriendRequests } from '../hooks/useSentFriendRequests';
import { useRemoveFriend } from '../hooks/useRemoveFriend';

jest.mock('../hooks/useSentFriendRequests', () => ({
    useSentFriendRequests: jest.fn(),
}));

jest.mock('../hooks/useRemoveFriend', () => ({
    useRemoveFriend: jest.fn(),
}));

jest.mock('../components/social/UserCard', () => (props: any) => (
    <div data-testid="user-card">
        <div>{props.username}</div>
        <div>{props.index}</div>
        <div>{props.uuid}</div>
        {props.action}
    </div>
));

describe('SentRequestsTab', () => {
    const mockMutate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRemoveFriend as jest.Mock).mockReturnValue({ mutate: mockMutate });
    });

    it('shows loading message when loading', () => {
        (useSentFriendRequests as jest.Mock).mockReturnValue({
            isLoading: true,
            data: [],
        });

        render(<SentRequestsTab />);
        expect(screen.getByText(/loading sent requests/i)).toBeInTheDocument();
    });

    it('shows message when no requests are present', () => {
        (useSentFriendRequests as jest.Mock).mockReturnValue({
            isLoading: false,
            data: [],
        });

        render(<SentRequestsTab />);
        expect(screen.getByText(/no sent friend requests/i)).toBeInTheDocument();
    });

    it('renders user cards for sent friend requests', () => {
        (useSentFriendRequests as jest.Mock).mockReturnValue({
            isLoading: false,
            data: [
                {
                    id: 'request-1',
                    secondUser: {
                        uuid: 'user-1',
                        username: 'TestUser',
                        imageUrl: 'avatar.jpg',
                        createdAt: '2023-01-01',
                    },
                },
            ],
        });

        render(<SentRequestsTab />);
        const card = screen.getByTestId('user-card');
        expect(card).toHaveTextContent('TestUser');
        expect(card).toHaveTextContent('1');
        expect(card).toHaveTextContent('user-1');
        expect(screen.getByRole('button', { name: /cancel request/i })).toBeInTheDocument();
    });

    it('calls removeFriend.mutate when cancel button is clicked', () => {
        (useSentFriendRequests as jest.Mock).mockReturnValue({
            isLoading: false,
            data: [
                {
                    id: 'request-1',
                    secondUser: {
                        uuid: 'user-1',
                        username: 'TestUser',
                        imageUrl: 'avatar.jpg',
                        createdAt: '2023-01-01',
                    },
                },
            ],
        });

        render(<SentRequestsTab />);
        fireEvent.click(screen.getByRole('button', { name: /cancel request/i }));
        expect(mockMutate).toHaveBeenCalledWith('request-1');
    });
});
