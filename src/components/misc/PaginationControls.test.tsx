import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaginationControls from './PaginationControls';

describe('PaginationControls', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the current page number correctly', () => {
        render(<PaginationControls page={3} hasNext={true} onChange={mockOnChange} />);
        expect(screen.getByText(/page 3/i)).toBeInTheDocument();
    });

    it('disables the Previous button on first page', () => {
        render(<PaginationControls page={1} hasNext={true} onChange={mockOnChange} />);
        expect(screen.getByLabelText(/previous page/i)).toBeDisabled();
    });

    it('enables the Previous button on pages greater than 1', () => {
        render(<PaginationControls page={2} hasNext={true} onChange={mockOnChange} />);
        expect(screen.getByLabelText(/previous page/i)).toBeEnabled();
    });

    it('disables the Next button when hasNext is false', () => {
        render(<PaginationControls page={2} hasNext={false} onChange={mockOnChange} />);
        expect(screen.getByLabelText(/next page/i)).toBeDisabled();
    });

    it('enables the Next button when hasNext is true', () => {
        render(<PaginationControls page={2} hasNext={true} onChange={mockOnChange} />);
        expect(screen.getByLabelText(/next page/i)).toBeEnabled();
    });

    it('calls onChange with -1 when Previous button is clicked', () => {
        render(<PaginationControls page={3} hasNext={true} onChange={mockOnChange} />);
        fireEvent.click(screen.getByLabelText(/previous page/i));
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith(-1);
    });

    it('does not call onChange when Previous button is disabled and clicked', () => {
        render(<PaginationControls page={1} hasNext={true} onChange={mockOnChange} />);
        fireEvent.click(screen.getByLabelText(/previous page/i));
        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('calls onChange with 1 when Next button is clicked', () => {
        render(<PaginationControls page={2} hasNext={true} onChange={mockOnChange} />);
        fireEvent.click(screen.getByLabelText(/next page/i));
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith(1);
    });

    it('does not call onChange when Next button is disabled and clicked', () => {
        render(<PaginationControls page={2} hasNext={false} onChange={mockOnChange} />);
        fireEvent.click(screen.getByLabelText(/next page/i));
        expect(mockOnChange).not.toHaveBeenCalled();
    });
});
