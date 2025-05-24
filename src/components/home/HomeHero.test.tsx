import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeHero from './HomeHero';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth0 } from '@auth0/auth0-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';

jest.mock('@auth0/auth0-react');
jest.mock('../../hooks/useCurrentUser', () => ({
    useCurrentUser: jest.fn(),
}));

const mockLoginWithRedirect = jest.fn();

const mockUser = {
    uuid: 'user-123',
    username: 'chessmaster42',
    imageUrl: 'https://example.com/avatar.png',
};

const renderWithProviders = (ui: React.ReactElement) => {
    const theme = createTheme();
    return render(
        <MemoryRouter>
            <ThemeProvider theme={theme}>{ui}</ThemeProvider>
        </MemoryRouter>
    );
};

describe('HomeHero component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth0 as jest.Mock).mockReturnValue({
            loginWithRedirect: mockLoginWithRedirect,
        });
    });

    describe('when user is logged in', () => {
        beforeEach(() => {
            (useCurrentUser as jest.Mock).mockReturnValue({ data: mockUser });
        });

        it('renders titles', () => {
            renderWithProviders(<HomeHero />);
            expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Play Chess Online');
            expect(screen.getByText(/Challenge your friends/i)).toBeInTheDocument();
        });

        it('renders Start playing button linking to /play', () => {
            renderWithProviders(<HomeHero />);
            const startBtn = screen.getByRole('link', { name: /start playing/i });
            expect(startBtn).toBeInTheDocument();
            expect(startBtn.closest('a')).toHaveAttribute('href', '/play');
        });

        it('does not render Join us button', () => {
            renderWithProviders(<HomeHero />);
            expect(screen.queryByRole('button', { name: /join us/i })).not.toBeInTheDocument();
        });
    });

    describe('when user is NOT logged in', () => {
        beforeEach(() => {
            (useCurrentUser as jest.Mock).mockReturnValue({ data: null });
        });

        it('renders titles', () => {
            renderWithProviders(<HomeHero />);
            expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Play Chess Online');
            expect(screen.getByText(/Challenge your friends/i)).toBeInTheDocument();
        });

        it('renders Join us button that calls loginWithRedirect when clicked', () => {
            renderWithProviders(<HomeHero />);
            const joinBtn = screen.getByRole('button', { name: /join us/i });
            expect(joinBtn).toBeInTheDocument();
            fireEvent.click(joinBtn);
            expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
        });

        it('does not render "Start playing" button', () => {
            renderWithProviders(<HomeHero />);
            expect(screen.queryByRole('link', { name: /start playing/i })).not.toBeInTheDocument();
        });
    });
});
