import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageHeader from './PageHeader';
import { ThemeProvider, createTheme } from '@mui/material/styles';

describe('PageHeader', () => {
    const renderWithTheme = (ui: React.ReactElement) => {
        const theme = createTheme();
        return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
    };

    it('renders the title correctly', () => {
        renderWithTheme(<PageHeader title="Dashboard" />);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('applies the sx prop styles', () => {
        renderWithTheme(<PageHeader title="Styled" sx={{ color: 'red' }} />);
        const heading = screen.getByText('Styled');
        expect(heading).toHaveStyle('color: red');
    });
});
