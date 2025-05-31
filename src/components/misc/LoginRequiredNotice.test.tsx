import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginRequiredNotice from './LoginRequiredNotice';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const renderWithTheme = (ui: React.ReactElement) => {
    const theme = createTheme();
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('LoginRequiredNotice', () => {
    it('renders without crashing', () => {
        renderWithTheme(<LoginRequiredNotice />);
        expect(screen.getByText(/Hey there!/i)).toBeInTheDocument();
    });

    it('renders the icon', () => {
        renderWithTheme(<LoginRequiredNotice />);
        // Find the EmojiPeople icon via role or class workaround
        expect(screen.getByTestId('EmojiPeopleIcon')).toBeInTheDocument();
    });

    it('renders the headline and body text', () => {
        renderWithTheme(<LoginRequiredNotice />);
        expect(screen.getByText(/Hey there!/i)).toBeInTheDocument();
        expect(
            screen.getByText(/To see this page, you'll need to log in./i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/We'd love to have you join us!/i)
        ).toBeInTheDocument();
    });
});
