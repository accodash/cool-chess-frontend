import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from './UserProfile';
import { useParams } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useUserById } from '../hooks/useUserById';
import { useFriends } from '../hooks/useFriends';

jest.mock('../components/misc/PageHeader', () => () => <div data-testid="page-header">PageHeader</div>);
jest.mock('../components/social/profile/UserProfileHeader', () => (props: any) => (
    <div data-testid="user-profile-header">{props.isCurrentUser ? 'Own Profile' : 'Other Profile'}</div>
));
jest.mock('../components/social/profile/RatingsGrid', () => (props: any) => (
    <div data-testid="ratings-grid">
        {Object.entries(props.ratings).map(([mode, rating]) => (
            <div key={mode}>{`${mode}: ${rating}`}</div>
        ))}
        {props.showMatchButton && <button>Match</button>}
    </div>
));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

jest.mock('../hooks/useCurrentUser', () => ({
    useCurrentUser: jest.fn(),
}));

jest.mock('../hooks/useUserById', () => ({
    useUserById: jest.fn(),
}));

jest.mock('../hooks/useFriends', () => ({
    useFriends: jest.fn(),
}));

describe('UserProfile', () => {
    const mockUser = {
        uuid: 'user-1',
        ratings: [
            { mode: 'osu', rating: 1234 },
            { mode: 'mania', rating: 2345 },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useParams as jest.Mock).mockReturnValue({ id: 'user-1' });
    });

    it('returns null if user is loading', () => {
        (useUserById as jest.Mock).mockReturnValue({ data: null, isLoading: true });
        (useCurrentUser as jest.Mock).mockReturnValue({ data: {} });
        (useFriends as jest.Mock).mockReturnValue({ data: [] });

        const { container } = render(<UserProfile />);
        expect(container).toBeEmptyDOMElement();
    });

    it('returns null if profileUser is null', () => {
        (useUserById as jest.Mock).mockReturnValue({ data: null, isLoading: false });
        (useCurrentUser as jest.Mock).mockReturnValue({ data: {} });
        (useFriends as jest.Mock).mockReturnValue({ data: [] });

        const { container } = render(<UserProfile />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders own profile correctly', () => {
        (useUserById as jest.Mock).mockReturnValue({ data: mockUser, isLoading: false });
        (useCurrentUser as jest.Mock).mockReturnValue({ data: { uuid: 'user-1' } });
        (useFriends as jest.Mock).mockReturnValue({ data: [] });

        render(<UserProfile />);

        expect(screen.getByTestId('page-header')).toBeInTheDocument();
        expect(screen.getByTestId('user-profile-header')).toHaveTextContent('Own Profile');
        expect(screen.getByTestId('ratings-grid')).toBeInTheDocument();
        expect(screen.queryByText('Match')).not.toBeInTheDocument();
    });

    it('renders other profile with friend and shows match button', () => {
        (useUserById as jest.Mock).mockReturnValue({ data: mockUser, isLoading: false });
        (useCurrentUser as jest.Mock).mockReturnValue({ data: { uuid: 'current-user' } });
        (useFriends as jest.Mock).mockReturnValue({
            data: [
                {
                    firstUser: { uuid: 'user-1' },
                    secondUser: { uuid: 'current-user' },
                    befriendedAt: '2023-01-01',
                },
            ],
        });

        render(<UserProfile />);

        expect(screen.getByTestId('user-profile-header')).toHaveTextContent('Other Profile');
        expect(screen.getByText('Match')).toBeInTheDocument();
    });

    it('renders other profile without friend and hides match button', () => {
        (useUserById as jest.Mock).mockReturnValue({ data: mockUser, isLoading: false });
        (useCurrentUser as jest.Mock).mockReturnValue({ data: { uuid: 'current-user' } });
        (useFriends as jest.Mock).mockReturnValue({ data: [] });

        render(<UserProfile />);

        expect(screen.getByTestId('user-profile-header')).toHaveTextContent('Other Profile');
        expect(screen.queryByText('Match')).not.toBeInTheDocument();
    });

    it('handles null ratings correctly', () => {
        const userWithoutRatings = { 
            uuid: 'user-1', 
            ratings: null 
        };
        
        (useUserById as jest.Mock).mockReturnValue({ data: userWithoutRatings, isLoading: false });
        (useCurrentUser as jest.Mock).mockReturnValue({ data: { uuid: 'current-user' } });
        (useFriends as jest.Mock).mockReturnValue({ data: [] });

        render(<UserProfile />);
        
        expect(screen.getByTestId('ratings-grid')).toBeInTheDocument();
        expect(screen.queryByText('osu: 1234')).not.toBeInTheDocument();
        expect(screen.queryByText('mania: 2345')).not.toBeInTheDocument();
    });

    it('handles currentUser being null', () => {
        (useUserById as jest.Mock).mockReturnValue({ data: mockUser, isLoading: false });
        (useCurrentUser as jest.Mock).mockReturnValue({ data: null });
        (useFriends as jest.Mock).mockReturnValue({ data: [] });

        render(<UserProfile />);
        
        expect(screen.getByTestId('user-profile-header')).toHaveTextContent('Other Profile');
    });

    it('detects friend when current user is second in relation', () => {
        (useUserById as jest.Mock).mockReturnValue({ data: mockUser, isLoading: false });
        (useCurrentUser as jest.Mock).mockReturnValue({ data: { uuid: 'current-user' } });
        (useFriends as jest.Mock).mockReturnValue({
            data: [
                {
                    firstUser: { uuid: 'current-user' },
                    secondUser: { uuid: 'user-1' },
                    befriendedAt: '2023-01-01',
                },
            ],
        });

        render(<UserProfile />);
        
        expect(screen.getByText('Match')).toBeInTheDocument();
    });

    it('handles undefined id parameter', () => {
        (useParams as jest.Mock).mockReturnValue({ id: undefined });
        (useUserById as jest.Mock).mockReturnValue({ data: null, isLoading: false });
        (useCurrentUser as jest.Mock).mockReturnValue({ data: {} });
        (useFriends as jest.Mock).mockReturnValue({ data: [] });

        const { container } = render(<UserProfile />);
        expect(container).toBeEmptyDOMElement();
    });

    it('handles null friends data', () => {
        (useUserById as jest.Mock).mockReturnValue({ data: mockUser, isLoading: false });
        (useCurrentUser as jest.Mock).mockReturnValue({ data: { uuid: 'current-user' } });
        (useFriends as jest.Mock).mockReturnValue({ data: null });

        render(<UserProfile />);
        
        expect(screen.queryByText('Match')).not.toBeInTheDocument();
    });

    it('handles undefined friends data', () => {
        (useUserById as jest.Mock).mockReturnValue({ data: mockUser, isLoading: false });
        (useCurrentUser as jest.Mock).mockReturnValue({ data: { uuid: 'current-user' } });
        (useFriends as jest.Mock).mockReturnValue({ data: undefined });

        render(<UserProfile />);
        
        expect(screen.queryByText('Match')).not.toBeInTheDocument();
    });
});
