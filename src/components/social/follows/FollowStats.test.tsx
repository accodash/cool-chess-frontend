import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FollowStats from './FollowStats';

describe('FollowStats', () => {
    const mockFollowersClick = jest.fn();
    const mockFollowingsClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders both follower and following counts', () => {
        render(
            <FollowStats
                followers={42}
                following={21}
                onFollowersClick={mockFollowersClick}
                onFollowingsClick={mockFollowingsClick}
            />
        );

        expect(screen.getByText('Followers: 42')).toBeInTheDocument();
        expect(screen.getByText('Following: 21')).toBeInTheDocument();
    });

    it('calls onFollowersClick when the followers button is clicked', () => {
        render(
            <FollowStats
                followers={10}
                following={5}
                onFollowersClick={mockFollowersClick}
                onFollowingsClick={mockFollowingsClick}
            />
        );

        fireEvent.click(screen.getByText(/Followers:/i));
        expect(mockFollowersClick).toHaveBeenCalledTimes(1);
    });

    it('calls onFollowingsClick when the following button is clicked', () => {
        render(
            <FollowStats
                followers={10}
                following={5}
                onFollowersClick={mockFollowersClick}
                onFollowingsClick={mockFollowingsClick}
            />
        );

        fireEvent.click(screen.getByText(/Following:/i));
        expect(mockFollowingsClick).toHaveBeenCalledTimes(1);
    });
});
