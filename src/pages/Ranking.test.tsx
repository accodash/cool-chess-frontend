import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Ranking from './Ranking';
import { useRanking } from '../hooks/useRanking';

jest.mock('../components/ranking/ModeSelector', () => (props: any) => (
    <div data-testid="mode-selector" onClick={() => props.onSelect('rapid')}>
        Mode: {props.selectedMode}
    </div>
));
jest.mock('../components/ranking/RankingList', () => (props: any) => (
    <div data-testid="ranking-list">Ranking List with {props.entries.length} entries</div>
));
jest.mock('../components/misc/PaginationControls', () => (props: any) => (
    <div data-testid="pagination-controls" onClick={() => props.onChange(1)}>
        Page {props.page}, hasNext: {props.hasNext.toString()}
    </div>
));

jest.mock('../hooks/useRanking', () => ({
    useRanking: jest.fn(),
}));

const setSearchParams = jest.fn();
jest.mock('react-router-dom', () => {
    const original = jest.requireActual('react-router-dom');
    return {
        ...original,
        useSearchParams: () => [new URLSearchParams(), setSearchParams],
    };
});

describe('Ranking Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows loading spinner when loading', () => {
        (useRanking as jest.Mock).mockReturnValue({ data: [], isLoading: true, isError: false });

        render(<Ranking />, { wrapper: MemoryRouter });

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows error message when error', () => {
        (useRanking as jest.Mock).mockReturnValue({ data: [], isLoading: false, isError: true });

        render(<Ranking />, { wrapper: MemoryRouter });

        expect(screen.getByText(/failed to load ranking/i)).toBeInTheDocument();
    });

    it('displays ranking list when data is available', () => {
        (useRanking as jest.Mock).mockReturnValue({
            data: Array(50).fill({ username: 'user', rating: 1000 }),
            isLoading: false,
            isError: false,
        });

        render(<Ranking />, { wrapper: MemoryRouter });

        expect(screen.getByTestId('ranking-list')).toHaveTextContent('Ranking List with 50 entries');
    });

    it('triggers mode change correctly', () => {
        (useRanking as jest.Mock).mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
        });

        render(<Ranking />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByTestId('mode-selector'));
        expect(setSearchParams).toHaveBeenCalledWith({ mode: 'rapid', page: '1' });
    });

    it('triggers page change correctly', () => {
        (useRanking as jest.Mock).mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
        });

        render(<Ranking />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByTestId('pagination-controls'));
        expect(setSearchParams).toHaveBeenCalledWith({ mode: 'bullet', page: '2' });
    });

    it('handles case when data is not yet loaded', () => {
        (useRanking as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
        });
    
        render(<Ranking />, { wrapper: MemoryRouter });
    
        expect(screen.getByTestId('ranking-list')).toHaveTextContent('Ranking List with 0 entries');
        expect(screen.getByTestId('pagination-controls')).toHaveTextContent('Page 1, hasNext: false');
    });
});
