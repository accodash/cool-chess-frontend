import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmDialog from './ConfirmDialog';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const renderWithTheme = (ui: React.ReactElement) => {
    const theme = createTheme();
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('ConfirmDialog', () => {
    const mockOnClose = jest.fn();
    const mockOnConfirm = jest.fn();

    const defaultProps = {
        open: true,
        title: 'Delete Item',
        content: 'Are you sure you want to delete this item?',
        onClose: mockOnClose,
        onConfirm: mockOnConfirm,
        confirmText: 'Delete',
        cancelText: 'Back',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders dialog with given title, content, and buttons', () => {
        renderWithTheme(<ConfirmDialog {...defaultProps} />);
        expect(screen.getByText(/Delete Item/)).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to delete this item?/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
    });

    it('calls onClose when cancel button is clicked', () => {
        renderWithTheme(<ConfirmDialog {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: /Back/i }));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onConfirm when confirm button is clicked', () => {
        renderWithTheme(<ConfirmDialog {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('does not render when `open` is false', () => {
        renderWithTheme(<ConfirmDialog {...defaultProps} open={false} />);
        expect(screen.queryByText(/Delete Item/)).not.toBeInTheDocument();
    });

    it('uses default button text when no confirmText or cancelText provided', () => {
        renderWithTheme(
            <ConfirmDialog
                {...defaultProps}
                confirmText={undefined}
                cancelText={undefined}
            />
        );
        expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });
});
