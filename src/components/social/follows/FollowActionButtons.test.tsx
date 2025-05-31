import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FollowActionButtons from './FollowActionButtons';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { useFollowings } from '../../../hooks/useFollowings';
import { useFollowUser } from '../../../hooks/useFollowUser';
import { useUnfollowUser } from '../../../hooks/useUnfollowUser';

jest.mock('../../../hooks/useCurrentUser', () => ({
    useCurrentUser: jest.fn(),
}));

jest.mock('../../../hooks/useFollowings', () => ({
    useFollowings: jest.fn(),
}));

jest.mock('../../../hooks/useFollowUser', () => ({
    useFollowUser: jest.fn(),
}));

jest.mock('../../../hooks/useUnfollowUser', () => ({
    useUnfollowUser: jest.fn(),
}));

describe('FollowActionButtons', () => {
    const mockFollow = jest.fn();
    const mockUnfollow = jest.fn();

    const currentUser = { uuid: '123' };
    const targetUserId = '456';

    beforeEach(() => {
        jest.clearAllMocks();
        (useFollowUser as jest.Mock).mockReturnValue({
            mutate: mockFollow,
            isPending: false,
        });
        (useUnfollowUser as jest.Mock).mockReturnValue({
            mutate: mockUnfollow,
            isPending: false,
        });
    });

    it('does not render if currentUser is null', () => {
        (useCurrentUser as jest.Mock).mockReturnValue({ data: null });
        (useFollowings as jest.Mock).mockReturnValue({ data: [] });

        const { container } = render(<FollowActionButtons userId={targetUserId} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('does not render if userId matches currentUser', () => {
        (useCurrentUser as jest.Mock).mockReturnValue({ data: currentUser });
        (useFollowings as jest.Mock).mockReturnValue({ data: [] });

        const { container } = render(<FollowActionButtons userId="123" />);
        expect(container).toBeEmptyDOMElement();
    });

    it('shows Follow button if not already following', () => {
        (useCurrentUser as jest.Mock).mockReturnValue({ data: currentUser });
        (useFollowings as jest.Mock).mockReturnValue({ data: [] });

        render(<FollowActionButtons userId={targetUserId} />);
        expect(screen.getByText('Follow')).toBeInTheDocument();
    });

    it('shows Unfollow button if already following', () => {
        (useCurrentUser as jest.Mock).mockReturnValue({ data: currentUser });
        (useFollowings as jest.Mock).mockReturnValue({
            data: [{ followedUser: { uuid: targetUserId } }],
        });

        render(<FollowActionButtons userId={targetUserId} />);
        expect(screen.getByText('Unfollow')).toBeInTheDocument();
    });

    it('calls follow mutation when Follow button is clicked', () => {
        (useCurrentUser as jest.Mock).mockReturnValue({ data: currentUser });
        (useFollowings as jest.Mock).mockReturnValue({ data: [] });

        render(<FollowActionButtons userId={targetUserId} />);
        fireEvent.click(screen.getByText('Follow'));

        expect(mockFollow).toHaveBeenCalledWith(targetUserId);
    });

    it('calls unfollow mutation when Unfollow button is clicked', () => {
        (useCurrentUser as jest.Mock).mockReturnValue({ data: currentUser });
        (useFollowings as jest.Mock).mockReturnValue({
            data: [{ followedUser: { uuid: targetUserId } }],
        });

        render(<FollowActionButtons userId={targetUserId} />);
        fireEvent.click(screen.getByText('Unfollow'));

        expect(mockUnfollow).toHaveBeenCalledWith(targetUserId);
    });

    it('disables Follow button when follow mutation is pending', () => {
        (useCurrentUser as jest.Mock).mockReturnValue({ data: currentUser });
        (useFollowings as jest.Mock).mockReturnValue({ data: [] });
        (useFollowUser as jest.Mock).mockReturnValue({
            mutate: mockFollow,
            isPending: true,
        });

        render(<FollowActionButtons userId={targetUserId} />);
        expect(screen.getByText('Follow')).toBeDisabled();
    });

    it('disables Unfollow button when unfollow mutation is pending', () => {
        (useCurrentUser as jest.Mock).mockReturnValue({ data: currentUser });
        (useFollowings as jest.Mock).mockReturnValue({
            data: [{ followedUser: { uuid: targetUserId } }],
        });
        (useUnfollowUser as jest.Mock).mockReturnValue({
            mutate: mockUnfollow,
            isPending: true,
        });

        render(<FollowActionButtons userId={targetUserId} />);
        expect(screen.getByText('Unfollow')).toBeDisabled();
    });

    it('handles followings being null gracefully and shows Follow button', () => {
        (useCurrentUser as jest.Mock).mockReturnValue({ data: currentUser });
        (useFollowings as jest.Mock).mockReturnValue({ data: null });

        render(<FollowActionButtons userId={targetUserId} />);
        expect(screen.getByText('Follow')).toBeInTheDocument();
    });
});
