import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfileHeader from './UserProfileHeader';

jest.mock('../../../hooks/useFollowers', () => ({
    useFollowers: jest.fn(() => ({
        data: [
            { follower: { uuid: 'f1', username: 'FollowerOne' } },
            { follower: { uuid: 'f2', username: 'FollowerTwo' } },
        ],
    })),
}));

jest.mock('../../../hooks/useFollowings', () => ({
    useFollowings: jest.fn(() => ({ data: [{ followedUser: { uuid: 'fu1', username: 'FollowedOne' } }] })),
}));

jest.mock('../follows/FollowStats', () => (props: any) => (
    <>
        <button onClick={props.onFollowersClick}>Followers: {props.followers}</button>
        <button onClick={props.onFollowingsClick}>Following: {props.following}</button>
    </>
));

jest.mock(
    './EditProfileDialog',
    () => (props: any) =>
        props.open ? (
            <div>
                Edit Profile Dialog
                <button onClick={props.onClose}>Close</button>
            </div>
        ) : null
);

jest.mock(
    '../follows/FollowDialog',
    () => (props: any) =>
        props.open ? (
            <div>
                {props.title} Dialog
                <button onClick={props.onClose}>Close</button>
            </div>
        ) : null
);

jest.mock('../follows/FollowActionButtons', () => () => <div>FollowActionButtons</div>);
jest.mock('../FriendActionButtons', () => () => <div>FriendActionButtons</div>);

const mockUser = {
    uuid: 'user1',
    username: 'TestUser',
    imageUrl: null,
    createdAt: '2025-05-08T16:05:44.644Z',
};

describe('UserProfileHeader', () => {
    it('renders user info and Edit Profile button for current user', () => {
        render(<UserProfileHeader user={mockUser} isCurrentUser={true} />);

        expect(screen.getByText(mockUser.username)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /followers: 2/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /following: 1/i })).toBeInTheDocument();
    });

    it('renders FollowActionButtons and FriendActionButtons for other users', () => {
        render(<UserProfileHeader user={mockUser} isCurrentUser={false} />);

        expect(screen.getByText(mockUser.username)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /edit profile/i })).not.toBeInTheDocument();
        expect(screen.getByText('FollowActionButtons')).toBeInTheDocument();
        expect(screen.getByText('FriendActionButtons')).toBeInTheDocument();
    });

    it('opens EditProfileDialog when Edit Profile button clicked', () => {
        render(<UserProfileHeader user={mockUser} isCurrentUser={true} />);

        const editButton = screen.getByRole('button', { name: /edit profile/i });
        fireEvent.click(editButton);

        expect(screen.getByText(/edit profile dialog/i)).toBeInTheDocument();
    });

    it('closes EditProfileDialog when buttons clicked', () => {
        render(<UserProfileHeader user={mockUser} isCurrentUser={true} />);

        const editButton = screen.getByRole('button', { name: /edit profile/i });
        fireEvent.click(editButton);

        expect(screen.getByText(/edit profile dialog/i)).toBeInTheDocument();

        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(screen.queryByText(/edit profile dialog/i)).not.toBeInTheDocument();
    });

    it('opens Followers dialog when Followers button clicked', () => {
        render(<UserProfileHeader user={mockUser} isCurrentUser={true} />);

        const followersBtn = screen.getByRole('button', { name: /followers: 2/i });
        fireEvent.click(followersBtn);

        expect(screen.getByText(/followers dialog/i)).toBeInTheDocument();
    });

    it('closes Followers dialog when Followers button clicked', () => {
        render(<UserProfileHeader user={mockUser} isCurrentUser={true} />);

        const followersBtn = screen.getByRole('button', { name: /followers: 2/i });
        fireEvent.click(followersBtn);

        expect(screen.getByText(/followers dialog/i)).toBeInTheDocument();

        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(screen.queryByText(/followers dialog/i)).not.toBeInTheDocument();
    });

    it('opens Followings dialog when Following button clicked', () => {
        render(<UserProfileHeader user={mockUser} isCurrentUser={true} />);

        const followingBtn = screen.getByRole('button', { name: /following: 1/i });
        fireEvent.click(followingBtn);

        expect(screen.getByText(/followings dialog/i)).toBeInTheDocument();
    });

    it('closes Followings dialog when Following button clicked', () => {
        render(<UserProfileHeader user={mockUser} isCurrentUser={true} />);

        const followingBtn = screen.getByRole('button', { name: /following: 1/i });
        fireEvent.click(followingBtn);

        expect(screen.getByText(/followings dialog/i)).toBeInTheDocument();

        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(screen.queryByText(/followings dialog/i)).not.toBeInTheDocument();
    });

    it('renders Avatar with image when imageUrl is provided', () => {
        const userWithImage = { ...mockUser, imageUrl: 'http://example.com/avatar.jpg' };
        render(<UserProfileHeader user={userWithImage} isCurrentUser={true} />);

        const avatarImg = screen.getByRole('img');
        expect(avatarImg).toHaveAttribute('src', 'http://example.com/avatar.jpg');

        expect(screen.queryByTestId('person-icon')).not.toBeInTheDocument();
    });

    it('renders correctly with no followers or followings', () => {
        const { useFollowers } = require('../../../hooks/useFollowers');
        const { useFollowings } = require('../../../hooks/useFollowings');

        useFollowers.mockReturnValue({ data: [] });
        useFollowings.mockReturnValue({ data: [] });

        render(<UserProfileHeader user={mockUser} isCurrentUser={true} />);

        expect(screen.getByRole('button', { name: /followers: 0/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /following: 0/i })).toBeInTheDocument();
    });

    it('renders correctly when followers and followings are null', () => {
        const { useFollowers } = require('../../../hooks/useFollowers');
        const { useFollowings } = require('../../../hooks/useFollowings');

        useFollowers.mockReturnValue({ data: null });
        useFollowings.mockReturnValue({ data: null });

        render(<UserProfileHeader user={mockUser} isCurrentUser={true} />);

        expect(screen.getByRole('button', { name: /followers: 0/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /following: 0/i })).toBeInTheDocument();
    });

    it('opens Followers dialog when followers data is null', () => {
        const { useFollowers } = require('../../../hooks/useFollowers');
        useFollowers.mockReturnValue({ data: null });

        render(<UserProfileHeader user={mockUser} isCurrentUser={true} />);

        const followersBtn = screen.getByRole('button', { name: /followers: 0/i });
        fireEvent.click(followersBtn);

        expect(screen.getByText(/followers dialog/i)).toBeInTheDocument();
    });

    it('opens Followings dialog when followings data is null', () => {
        const { useFollowings } = require('../../../hooks/useFollowings');
        useFollowings.mockReturnValue({ data: null });

        render(<UserProfileHeader user={mockUser} isCurrentUser={true} />);

        const followingBtn = screen.getByRole('button', { name: /following: 0/i });
        fireEvent.click(followingBtn);

        expect(screen.getByText(/followings dialog/i)).toBeInTheDocument();
    });
});
