import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserCard from './UserCard';
import { MemoryRouter } from 'react-router-dom';

describe('UserCard', () => {
    const defaultProps = {
        index: 1,
        username: 'testuser',
        createdAt: '2023-01-15T12:00:00Z',
        imageUrl: 'https://example.com/avatar.jpg',
        followersCount: 2,
        uuid: 'user-uuid',
    };

    const renderWithRouter = (props = {}) =>
        render(<UserCard {...defaultProps} {...props} />, { wrapper: MemoryRouter });

    it('renders index properly', () => {
        renderWithRouter({ index: 5 });
        expect(screen.getByText('5.')).toBeInTheDocument();
    });

    it('renders username', () => {
        renderWithRouter();
        expect(screen.getByText(defaultProps.username)).toBeInTheDocument();
    });

    it('formats and displays the createdAt date in en-GB locale', () => {
        renderWithRouter();
        expect(screen.getByText(/Joined on 15 January 2023/)).toBeInTheDocument();
    });

    it('renders followers count with correct pluralization for multiple followers', () => {
        renderWithRouter({ followersCount: 3 });
        expect(screen.getByText('3 followers')).toBeInTheDocument();
    });

    it('renders followers count correctly for single follower', () => {
        renderWithRouter({ followersCount: 1 });
        expect(screen.getByText('1 follower')).toBeInTheDocument();
    });

    it('does not render followers count if undefined', () => {
        renderWithRouter({ followersCount: undefined });
        expect(screen.queryByText(/follower/)).not.toBeInTheDocument();
    });

    it('renders avatar image if imageUrl is provided', () => {
        renderWithRouter();
        const avatar = screen.getByRole('img');
        expect(avatar).toHaveAttribute('src', defaultProps.imageUrl);
        expect(screen.queryByTestId('PersonIcon')).not.toBeInTheDocument();
    });

    it('renders Person icon if imageUrl is null', () => {
        renderWithRouter({ imageUrl: null });
        expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
    });

    it('prevents navigation when action container is clicked', () => {
        const actionHandler = jest.fn();
        const action = (
            <button data-testid="action-button" onClick={actionHandler}>
                Action
            </button>
        );

        renderWithRouter({ action });

        const actionBtn = screen.getByTestId('action-button');
        const parentBox = actionBtn.parentElement;

        const preventDefaultSpy = jest.spyOn(Event.prototype, 'preventDefault');
        const stopPropagationSpy = jest.spyOn(Event.prototype, 'stopPropagation');

        if (parentBox) {
            fireEvent.click(parentBox);
        }

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();

        preventDefaultSpy.mockRestore();
        stopPropagationSpy.mockRestore();
    });

    it('has correct link href for user uuid', () => {
        renderWithRouter();
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', `/social/user/${defaultProps.uuid}`);
    });
});
