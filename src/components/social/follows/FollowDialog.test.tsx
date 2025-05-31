import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FollowDialog from './FollowDialog';
import { User } from '../../../api/users';

jest.mock('../UserCard', () => ({ username }: any) => (
    <div data-testid="UserCard">{username}</div>
));

const mockUsers: User[] = [
    {
        uuid: '1',
        username: 'UserOne',
        imageUrl: 'https://example.com/u1.png',
        createdAt: '2024-01-01',
    },
    {
        uuid: '2',
        username: 'UserTwo',
        imageUrl: 'https://example.com/u2.png',
        createdAt: '2024-01-02',
    },
];

describe('FollowDialog', () => {
    it('renders title with user count', () => {
        render(
            <FollowDialog
                open={true}
                onClose={jest.fn()}
                title="Followers"
                users={mockUsers}
            />
        );

        expect(screen.getByText('Followers (2)')).toBeInTheDocument();
    });

    it('renders UserCards for each user', () => {
        render(
            <FollowDialog
                open={true}
                onClose={jest.fn()}
                title="Following"
                users={mockUsers}
            />
        );

        const userCards = screen.getAllByTestId('UserCard');
        expect(userCards).toHaveLength(2);
        expect(screen.getByText('UserOne')).toBeInTheDocument();
        expect(screen.getByText('UserTwo')).toBeInTheDocument();
    });

    it('renders fallback text if no users are passed', () => {
        render(
            <FollowDialog
                open={true}
                onClose={jest.fn()}
                title="Following"
                users={[]}
            />
        );

        expect(screen.getByText('No users to display.')).toBeInTheDocument();
    });

    it('does not render anything when open is false', () => {
        const { container } = render(
            <FollowDialog
                open={false}
                onClose={jest.fn()}
                title="Followers"
                users={mockUsers}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('calls onClose when requested (via backdrop click)', () => {
        const handleClose = jest.fn();

        render(
            <FollowDialog
                open={true}
                onClose={handleClose}
                title="Followers"
                users={mockUsers}
            />
        );

        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

        expect(handleClose).not.toHaveBeenCalled();
    });
});
