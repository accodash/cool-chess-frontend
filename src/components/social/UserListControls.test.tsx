import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserListControls from './UserListControls';

describe('UserListControls', () => {
    const defaultProps = {
        search: 'initial search',
        sortBy: 'username',
        order: 'ASC',
        onSearchChange: jest.fn(),
        onSortChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders search input with initial value and search icon', () => {
        render(<UserListControls {...defaultProps} />);
        const input = screen.getByLabelText(/search by username/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue(defaultProps.search);

        const searchIcon = screen.getByTestId('SearchIcon');
        expect(searchIcon).toBeInTheDocument();
    });

    it('calls onSearchChange when typing in the search input', () => {
        render(<UserListControls {...defaultProps} />);
        const input = screen.getByLabelText(/search by username/i);

        fireEvent.change(input, { target: { value: 'new search' } });
        expect(defaultProps.onSearchChange).toHaveBeenCalledTimes(1);
        expect(defaultProps.onSearchChange).toHaveBeenCalledWith('new search');
    });

    it('renders select with correct value in hidden input', () => {
        render(<UserListControls {...defaultProps} />);

        const hiddenInput = document.querySelector('.MuiSelect-nativeInput') as HTMLInputElement;
        expect(hiddenInput).toBeInTheDocument();
        expect(hiddenInput.value).toBe('username-ASC');
    });

    it('renders all sort options in the dropdown', () => {
        render(<UserListControls {...defaultProps} />);

        const combobox = screen.getByRole('combobox', { name: /sort by/i });
        fireEvent.mouseDown(combobox);

        const options = screen.getAllByRole('option');
        expect(options.length).toBe(4);

        expect(options[0]).toHaveTextContent('Name (A-Z)');
        expect(options[0].getAttribute('data-value')).toBe('username-ASC');

        expect(options[1]).toHaveTextContent('Name (Z-A)');
        expect(options[1].getAttribute('data-value')).toBe('username-DESC');

        expect(options[2]).toHaveTextContent('Joined (Oldest)');
        expect(options[2].getAttribute('data-value')).toBe('createdAt-ASC');

        expect(options[3]).toHaveTextContent('Joined (Newest)');
        expect(options[3].getAttribute('data-value')).toBe('createdAt-DESC');
    });

    it('calls onSortChange with correct parameters when a different option is selected', () => {
        render(<UserListControls {...defaultProps} />);

        const select = screen.getByRole('combobox', { name: /sort by/i });

        fireEvent.mouseDown(select);

        const option = screen.getByText('Joined (Newest)');

        fireEvent.click(option);

        expect(defaultProps.onSortChange).toHaveBeenCalledTimes(1);
        expect(defaultProps.onSortChange).toHaveBeenCalledWith('createdAt', 'DESC');
    });
});
