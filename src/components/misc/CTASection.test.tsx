import { render, screen, fireEvent } from '@testing-library/react';
import CTASection from './CTASection';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth0 } from '@auth0/auth0-react';

jest.mock('@auth0/auth0-react');

describe('CTASection', () => {
    const mockLoginWithRedirect = jest.fn();

    beforeEach(() => {
        (useAuth0 as jest.Mock).mockReturnValue({
            loginWithRedirect: mockLoginWithRedirect,
        });
    });

    const renderWithTheme = (ui: React.ReactElement) => {
        const theme = createTheme();
        return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
    };

    it('renders the title and description text', () => {
        renderWithTheme(<CTASection />);
        expect(screen.getByText('Ready to make your first move?')).toBeInTheDocument();
        expect(
            screen.getByText('Sign in and start playing competitive chess right now.')
        ).toBeInTheDocument();
    });

    it('renders the Sign in button', () => {
        renderWithTheme(<CTASection />);
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('calls loginWithRedirect when the button is clicked', () => {
        renderWithTheme(<CTASection />);
        const button = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(button);
        expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
    });
});
