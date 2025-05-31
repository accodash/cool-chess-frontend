import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserListTab from './UserListTab';
import { useUsers } from '../hooks/useUsers';
import { useSearchParams } from 'react-router-dom';

jest.mock('@mui/material', () => {
    const original = jest.requireActual('@mui/material');
    return {
        ...original,
        CircularProgress: () => <div data-testid="loader">Loading...</div>,
    };
});

jest.mock('../components/social/UserCard', () => (props: any) => <div data-testid="user-card">{props.username}</div>);
jest.mock('../components/social/UserListControls', () => (props: any) => (
    <div>
        <button onClick={() => props.onSearchChange('test')}>Search</button>
        <button onClick={() => props.onSortChange('username', 'ASC')}>Sort</button>
    </div>
));
jest.mock('../components/misc/PaginationControls', () => (props: any) => (
    <div>
        <button onClick={() => props.onChange(-1)}>Prev</button>
        <button onClick={() => props.onChange(1)}>Next</button>
        <span data-testid="page">Page {props.page}</span>
    </div>
));

const mockSetParams = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useSearchParams: jest.fn(),
}));

const mockUseSearchParams = useSearchParams as jest.Mock;

jest.mock('../hooks/useUsers', () => ({
    useUsers: jest.fn(),
}));

describe('UserListTab', () => {
    const usersMock = Array.from({ length: 51 }).map((_, i) => ({
        uuid: `user-${i}`,
        username: `User ${i}`,
        createdAt: `2023-01-${i + 1}`,
        imageUrl: `https://img/${i}`,
        followersCount: i,
    }));

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseSearchParams.mockReturnValue([
            new URLSearchParams({
                page: '2',
                sortBy: 'createdAt',
                order: 'DESC',
                search: '',
            }),
            mockSetParams,
        ]);
    });

    it('shows loading spinner when isLoading is true', () => {
        (useUsers as jest.Mock).mockReturnValue({ data: [], isLoading: true });

        render(<UserListTab />);
        expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('shows user cards when data is loaded', () => {
        (useUsers as jest.Mock).mockReturnValue({ data: usersMock, isLoading: false });

        render(<UserListTab />);
        expect(screen.getAllByTestId('user-card')).toHaveLength(50);
    });

    it('handles search and sort correctly', () => {
        render(<UserListTab />);

        fireEvent.click(screen.getByText('Search'));
        expect(mockSetParams).toHaveBeenCalledWith(expect.any(Function));
        let updaterFn = mockSetParams.mock.calls[0][0];
        let prevParams = new URLSearchParams();
        let newParams = updaterFn(prevParams);
        expect(newParams).toBeInstanceOf(URLSearchParams);
        expect(newParams.has('search')).toBe(true);
        expect(newParams.get('page')).toBe('1');

        mockSetParams.mockClear();

        fireEvent.click(screen.getByText('Sort'));
        expect(mockSetParams).toHaveBeenCalledWith(expect.any(Function));
        updaterFn = mockSetParams.mock.calls[0][0];
        prevParams = new URLSearchParams();
        newParams = updaterFn(prevParams);
        expect(newParams).toBeInstanceOf(URLSearchParams);
        expect(newParams.has('sortBy')).toBe(true);
        expect(newParams.has('order')).toBe(true);
        expect(newParams.get('page')).toBe('1');
    });

    it('increments page on Next click', () => {
        render(<UserListTab />);
        mockSetParams.mockClear();

        fireEvent.click(screen.getByText('Next'));

        expect(mockSetParams).toHaveBeenCalledTimes(1);
        expect(mockSetParams).toHaveBeenCalledWith(expect.any(Function));

        const updaterFn = mockSetParams.mock.calls[0][0];
        const prevParams = new URLSearchParams();
        const newParams = updaterFn(prevParams);

        expect(newParams.get('page')).toBe('3');
    });

    it('increments page on Previous click', () => {
        render(<UserListTab />);
        mockSetParams.mockClear();

        fireEvent.click(screen.getByText('Prev'));

        expect(mockSetParams).toHaveBeenCalledTimes(1);
        expect(mockSetParams).toHaveBeenCalledWith(expect.any(Function));

        const updaterFn = mockSetParams.mock.calls[0][0];
        const prevParams = new URLSearchParams();
        const newParams = updaterFn(prevParams);

        expect(newParams.get('page')).toBe('1');
    });

    it('displays correct page number in pagination', () => {
        (useUsers as jest.Mock).mockReturnValue({ data: usersMock, isLoading: false });

        render(<UserListTab />);
        expect(screen.getByTestId('page')).toHaveTextContent('Page 2');
    });

    it('handles case when less than LIMIT users returned (no next page)', () => {
        (useUsers as jest.Mock).mockReturnValue({
            data: usersMock.slice(0, 49),
            isLoading: false,
        });

        render(<UserListTab />);
        expect(screen.getAllByTestId('user-card')).toHaveLength(49);
    });

    it('uses default search params when none are provided', () => {
        mockUseSearchParams.mockReturnValue([new URLSearchParams(), mockSetParams]);

        (useUsers as jest.Mock).mockReturnValue({ data: [], isLoading: false });

        render(<UserListTab />);

        expect(screen.getByTestId('page')).toHaveTextContent('Page 1');
        expect(screen.queryAllByTestId('user-card')).toHaveLength(0);
    });

    it('handles undefined data from useUsers hook gracefully', () => {
        (useUsers as jest.Mock).mockReturnValue({ data: undefined, isLoading: false });

        render(<UserListTab />);

        expect(screen.queryAllByTestId('user-card')).toHaveLength(0);
        expect(screen.getByTestId('page')).toBeInTheDocument();
    });
});
