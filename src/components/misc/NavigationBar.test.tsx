import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavigationBar from './NavigationBar';
import { MemoryRouter } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth0 } from '@auth0/auth0-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';

jest.mock('@auth0/auth0-react');
jest.mock('../../hooks/useCurrentUser', () => ({
    useCurrentUser: jest.fn(),
}));

jest.mock('@mui/material', () => {
    const originalModule = jest.requireActual('@mui/material');
    return {
        __esModule: true,
        ...originalModule,
        useMediaQuery: jest.fn(),
    };
});

const mockLoginWithRedirect = jest.fn();
const mockLogout = jest.fn();

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

describe('NavigationBar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth0 as jest.Mock).mockReturnValue({
            loginWithRedirect: mockLoginWithRedirect,
            logout: mockLogout,
        });
    });

    describe('when user is logged in', () => {
        beforeEach(() => {
            (useCurrentUser as jest.Mock).mockReturnValue({ data: mockUser });
        });

        it('renders navigation links to protected routes', () => {
            renderWithProviders(<NavigationBar />);

            expect(screen.getByText(/Play/i).closest('a')).toHaveAttribute('href', '/play');
            expect(screen.getByText(/Social/i).closest('a')).toHaveAttribute('href', '/social/friends');
        });

        it('renders user avatar and username', () => {
            renderWithProviders(<NavigationBar />);
            expect(screen.getByRole('img')).toHaveAttribute('src', mockUser.imageUrl);
            expect(screen.getByText(mockUser.username)).toBeInTheDocument();
        });

        it('calls logout on Sign Out button click', () => {
            renderWithProviders(<NavigationBar />);
            const signOutBtn = screen.getByRole('button', { name: /sign out/i });
            fireEvent.click(signOutBtn);
            expect(mockLogout).toHaveBeenCalledTimes(1);
        });

        it('links to the user profile', () => {
            renderWithProviders(<NavigationBar />);
            const profileButton = screen.getByText(mockUser.username).closest('a');
            expect(profileButton).toHaveAttribute('href', `/social/user/${mockUser.uuid}`);
        });
    });

    describe('when user is NOT logged in', () => {
        beforeEach(() => {
            (useCurrentUser as jest.Mock).mockReturnValue({ data: null });
        });

        it('renders public links', () => {
            renderWithProviders(<NavigationBar />);
            expect(screen.getByText(/Play/i).closest('a')).toHaveAttribute('href', '/play');
            expect(screen.getByText(/Social/i).closest('a')).toHaveAttribute('href', '/social/all-users');
        });

        it('renders Log In button and calls loginWithRedirect on click', () => {
            renderWithProviders(<NavigationBar />);
            const loginBtn = screen.getByRole('button', { name: /log in/i });
            fireEvent.click(loginBtn);
            expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
        });
    });

    describe('fallback avatar rendering', () => {
        it('renders fallback <Person> icon if no imageUrl', () => {
            (useCurrentUser as jest.Mock).mockReturnValue({
                data: { ...mockUser, imageUrl: null },
            });

            renderWithProviders(<NavigationBar />);
            expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
        });
    });

    describe('on mobile', () => {
        beforeEach(() => {
            (useMediaQuery as jest.Mock).mockReturnValue(true);
            (useAuth0 as jest.Mock).mockReturnValue({
                loginWithRedirect: mockLoginWithRedirect,
                logout: mockLogout,
            });
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('renders mobile menu icon', () => {
            (useCurrentUser as jest.Mock).mockReturnValue({ data: null });
            renderWithProviders(<NavigationBar />);
            const menuButton = screen.getByRole('button');
            expect(menuButton).toBeInTheDocument();
        });

        it('opens drawer on menu button click', () => {
            (useCurrentUser as jest.Mock).mockReturnValue({ data: null });
            renderWithProviders(<NavigationBar />);
            const menuButton = screen.getByRole('button');
            fireEvent.click(menuButton);
            const drawerPaper = document.querySelector('.MuiDrawer-paper') as HTMLElement;
            expect(drawerPaper).toBeInTheDocument();
            expect(drawerPaper).toHaveStyle({ transform: 'none' });
        });

        it('shows user avatar and username when logged in', () => {
            (useCurrentUser as jest.Mock).mockReturnValue({ data: mockUser });
            renderWithProviders(<NavigationBar />);
            const menuButton = screen.getByRole('button');
            fireEvent.click(menuButton);
            expect(screen.getByText(mockUser.username)).toBeInTheDocument();
            expect(screen.getByRole('img')).toHaveAttribute('src', mockUser.imageUrl);
        });

        it('shows Log In button when not logged in', () => {
            (useCurrentUser as jest.Mock).mockReturnValue({ data: null });
            renderWithProviders(<NavigationBar />);
            fireEvent.click(screen.getByRole('button'));
            expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
        });

        it('closes the drawer when clicking outside', async () => {
            (useCurrentUser as jest.Mock).mockReturnValue({ data: null });
            renderWithProviders(<NavigationBar />);

            const menuButton = screen.getByRole('button');
            fireEvent.click(menuButton);

            const drawerPaper = document.querySelector('.MuiDrawer-paper') as HTMLElement;
            expect(drawerPaper).toBeInTheDocument();
            expect(drawerPaper).toHaveStyle({ transform: 'none' });

            const backdrop = document.querySelector('.MuiBackdrop-root');
            if (backdrop) {
                fireEvent.click(backdrop);
            }

            expect(drawerPaper).not.toHaveStyle({ transform: 'none' });
        });
    });
});
