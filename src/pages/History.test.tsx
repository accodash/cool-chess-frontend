import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import History from './History';
import { useMatches } from '../hooks/useMatches';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useSearchParams } from 'react-router-dom';

jest.mock('../hooks/useMatches', () => ({
    useMatches: jest.fn(),
}));
jest.mock('../hooks/useCurrentUser', () => ({
    useCurrentUser: jest.fn(),
}));

jest.mock('../components/misc/PageHeader', () => () => <div>Mock PageHeader</div>);
jest.mock('../components/match/MatchCard', () => ({ match }: any) => <div>Mock MatchCard: {match.id}</div>);
jest.mock('../components/misc/LoginRequiredNotice', () => () => <div>Mock LoginRequiredNotice</div>);
jest.mock('../components/misc/PaginationControls', () => ({ page, hasNext, onChange }: any) => (
    <div>
        <button onClick={() => onChange(-1)} disabled={page <= 1}>
            Previous
        </button>
        <button onClick={() => onChange(1)} disabled={!hasNext}>
            Next
        </button>
    </div>
));

let currentPage = '1';
const mockSetParams = jest.fn((updater) => {
    const newParams = updater(new URLSearchParams({ page: currentPage }));
    currentPage = newParams.get('page')!;
});
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useSearchParams: jest.fn(),
}));

const mockedUseMatches = useMatches as jest.Mock;
const mockedUseCurrentUser = useCurrentUser as jest.Mock;
const mockedUseSearchParams = useSearchParams as jest.Mock;

describe('History Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseSearchParams.mockReturnValue([new URLSearchParams({ page: '1' }), mockSetParams]);
    });

    it('shows login notice when user is not logged in', () => {
        mockedUseCurrentUser.mockReturnValue({ data: null });
        render(<History />);
        expect(screen.getByText('Mock LoginRequiredNotice')).toBeInTheDocument();
        expect(screen.getByText('Mock PageHeader')).toBeInTheDocument();
    });

    it('shows loading spinner when matches are loading', () => {
        mockedUseCurrentUser.mockReturnValue({ data: { id: 'user1' } });
        mockedUseMatches.mockReturnValue({ data: [], isLoading: true });

        render(<History />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders match cards when data is available', () => {
        mockedUseCurrentUser.mockReturnValue({ data: { id: 'user1' } });
        const matches = Array.from({ length: 10 }, (_, i) => ({ id: `match-${i}` }));
        mockedUseMatches.mockReturnValue({ data: matches, isLoading: false });

        render(<History />);
        matches.forEach((match) => {
            expect(screen.getByText(`Mock MatchCard: ${match.id}`)).toBeInTheDocument();
        });
    });

    it('shows next page button if more matches exist', () => {
        mockedUseCurrentUser.mockReturnValue({ data: { id: 'user1' } });
        const matches = Array.from({ length: 11 }, (_, i) => ({ id: `match-${i}` }));
        mockedUseMatches.mockReturnValue({ data: matches, isLoading: false });

        render(<History />);
        const nextButton = screen.getByText('Next');
        expect(nextButton).toBeEnabled();
        fireEvent.click(nextButton);
        expect(mockSetParams).toHaveBeenCalled();
    });

    it('disables previous button on first page', () => {
        mockedUseCurrentUser.mockReturnValue({ data: { id: 'user1' } });
        const matches = Array.from({ length: 5 }, (_, i) => ({ id: `match-${i}` }));
        mockedUseMatches.mockReturnValue({ data: matches, isLoading: false });

        render(<History />);
        const prevButton = screen.getByText('Previous');
        expect(prevButton).toBeDisabled();
    });

    it('defaults to page 1 if no page param is provided', () => {
        mockedUseSearchParams.mockReturnValue([new URLSearchParams(), mockSetParams]);

        mockedUseCurrentUser.mockReturnValue({ data: { id: 'user1' } });
        const matches = Array.from({ length: 3 }, (_, i) => ({ id: `match-${i}` }));
        mockedUseMatches.mockReturnValue({ data: matches, isLoading: false });

        render(<History />);

        matches.forEach((match) => {
            expect(screen.getByText(`Mock MatchCard: ${match.id}`)).toBeInTheDocument();
        });
    });

    it('handles undefined match data gracefully', () => {
        mockedUseCurrentUser.mockReturnValue({ data: { id: 'user1' } });
        mockedUseMatches.mockReturnValue({ data: undefined, isLoading: false });

        render(<History />);

        expect(screen.queryByText(/Mock MatchCard/)).not.toBeInTheDocument();

        expect(screen.getByText('Mock PageHeader')).toBeInTheDocument();
    });
});
