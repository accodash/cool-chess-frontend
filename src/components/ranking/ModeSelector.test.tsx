import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModeSelector from './ModeSelector';

describe('ModeSelector', () => {
    const mockOnSelect = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all mode chips', () => {
        render(<ModeSelector selectedMode="blitz" onSelect={mockOnSelect} />);
        
        expect(screen.getByText('Bullet')).toBeInTheDocument();
        expect(screen.getByText('Blitz')).toBeInTheDocument();
        expect(screen.getByText('Rapid')).toBeInTheDocument();
    });

    it('highlights the selected mode chip', () => {
        render(<ModeSelector selectedMode="bullet" onSelect={mockOnSelect} />);

        const bulletChip = screen.getByText('Bullet').closest('div');
        const blitzChip = screen.getByText('Blitz').closest('div');

        expect(bulletChip).toHaveClass('MuiChip-colorPrimary');
        expect(blitzChip).not.toHaveClass('MuiChip-colorPrimary');
    });

    it('calls onSelect with correct value when a chip is clicked', () => {
        render(<ModeSelector selectedMode="blitz" onSelect={mockOnSelect} />);

        fireEvent.click(screen.getByText('Rapid'));
        expect(mockOnSelect).toHaveBeenCalledWith('rapid');

        fireEvent.click(screen.getByText('Bullet'));
        expect(mockOnSelect).toHaveBeenCalledWith('bullet');
    });
});
