import { render, screen } from '@testing-library/react';
import PlayerInfo from './PlayerInfo';
import { User } from '../../api/users';
import '@testing-library/jest-dom';
import * as formatUtils from '../../utils/formatTime';
import { ThemeProvider, createTheme } from '@mui/material/styles';

jest.mock('../../utils/formatTime', () => ({
    formatTime: jest.fn(),
}));

const mockUserWithImage: User = {
    uuid: 'rp123',
    username: 'Ryszardinio',
    createdAt: '2023-01-01',
    imageUrl: 'https://example.com/avatar.png',
};

const mockUserWithoutImage: User = {
    ...mockUserWithImage,
    imageUrl: null,
};

const renderWithProviders = (ui: React.ReactElement) => {
    const theme = createTheme();
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('PlayerInfo', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (formatUtils.formatTime as jest.Mock).mockImplementation((time: number) => `${time}s`);
    });

    it('renders avatar with image', () => {
        renderWithProviders(
            <PlayerInfo player={mockUserWithImage} color="white" timeLeft={300} />
        );
        const avatarImg = screen.getByAltText('avatar');
        expect(avatarImg).toHaveAttribute('src', mockUserWithImage.imageUrl!);
    });

    it('renders fallback icon when imageUrl is null', () => {
        renderWithProviders(
            <PlayerInfo player={mockUserWithoutImage} color="black" timeLeft={300} />
        );
        const fallbackIcon = screen.getByTestId('PersonIcon');
        expect(fallbackIcon).toBeInTheDocument();
    });

    it('displays the username', () => {
        renderWithProviders(
            <PlayerInfo player={mockUserWithImage} color="white" timeLeft={300} />
        );
        expect(screen.getByText(mockUserWithImage.username)).toBeInTheDocument();
    });

    it('displays formatted time', () => {
        renderWithProviders(
            <PlayerInfo player={mockUserWithImage} color="white" timeLeft={300} />
        );
        expect(formatUtils.formatTime).toHaveBeenCalledWith(300);
        expect(screen.getByText('300s')).toBeInTheDocument();
    });

    it('renders white king image for white player', () => {
        renderWithProviders(
            <PlayerInfo player={mockUserWithImage} color="white" timeLeft={300} />
        );
        const img = screen.getByAltText('piece');
        expect(img).toHaveAttribute('src', '/kw.png');
    });

    it('renders black king image for black player', () => {
        renderWithProviders(
            <PlayerInfo player={mockUserWithImage} color="black" timeLeft={300} />
        );
        const img = screen.getByAltText('piece');
        expect(img).toHaveAttribute('src', '/kb.png');
    });
});
