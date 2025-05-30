import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

describe('Footer', () => {
    const renderWithTheme = (ui: React.ReactElement) => {
        const theme = createTheme();
        return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
    };

    it('renders the copyright text with the current year', () => {
        renderWithTheme(<Footer />);
        const currentYear = new Date().getFullYear().toString();
        expect(
            screen.getByText((content) => content.includes(currentYear))
        ).toBeInTheDocument();
        expect(
            screen.getByText((content) => content.includes('Cool Chess'))
        ).toBeInTheDocument();
    });

    it('renders GitHub, Twitter, and Instagram icon buttons with correct links', () => {
        renderWithTheme(<Footer />);

        const githubLink = screen.getByRole('link', {
            name: /github/i,
        }) as HTMLAnchorElement;
        const twitterLink = screen.getByRole('link', {
            name: /twitter/i,
        }) as HTMLAnchorElement;
        const instagramLink = screen.getByRole('link', {
            name: /instagram/i,
        }) as HTMLAnchorElement;

        expect(githubLink).toHaveAttribute(
            'href',
            'https://github.com/accodash/cool-chess-frontend'
        );
        expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/');
        expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/');
    });
});
