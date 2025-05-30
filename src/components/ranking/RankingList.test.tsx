import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RankingList from './RankingList';
import { Rating } from '../../api/ratings';

const mockEntries: Rating[] = [
    {
        id: '1',
        rating: 1500,
        mode: 'bullet',
        user: {
            uuid: '1',
            username: 'RP',
            imageUrl: 'https://zsk.poznan.pl/ryszard.png',
            createdAt: '2025-05-08T16:06:44.644Z',
        },
    },
    {
        id: '2',
        rating: 1400,
        mode: 'bullet',
        user: {
            uuid: '2',
            username: 'Bravo',
            imageUrl: null,
            createdAt: '2025-05-08T16:05:44.644Z',
        },
    },
];

describe('RankingList', () => {
    it('renders all ranking entries', () => {
        render(<RankingList entries={mockEntries} offset={0} />);

        expect(screen.getByText('#1')).toBeInTheDocument();
        expect(screen.getByText('#2')).toBeInTheDocument();

        expect(screen.getByText('RP')).toBeInTheDocument();
        expect(screen.getByText('Bravo')).toBeInTheDocument();
    });

    it('renders the correct rating for each user', () => {
        render(<RankingList entries={mockEntries} offset={0} />);

        expect(screen.getByText('Elo: 1500')).toBeInTheDocument();
        expect(screen.getByText('Elo: 1400')).toBeInTheDocument();
    });

    it('renders avatar with image if imageUrl is present', () => {
        render(<RankingList entries={mockEntries} offset={0} />);

        const avatarWithImg = screen.getAllByRole('img')[0] as HTMLImageElement;
        expect(avatarWithImg.src).toBe('https://zsk.poznan.pl/ryszard.png');
    });

    it('renders fallback <Person /> icon if imageUrl is missing', () => {
        render(<RankingList entries={mockEntries} offset={0} />);

        expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
    });

    it('respects offset when calculating rankings', () => {
        render(<RankingList entries={mockEntries} offset={5} />);
        expect(screen.getByText('#6')).toBeInTheDocument();
        expect(screen.getByText('#7')).toBeInTheDocument();
    });

    it('renders fallback icon and skips username if user is null', () => {
        const entriesWithNullUser: Rating[] = [
            {
                id: '3',
                rating: 1300,
                mode: 'bullet',
                user: undefined,
            },
        ];
    
        render(<RankingList entries={entriesWithNullUser} offset={0} />);
        
        expect(screen.getByText('#1')).toBeInTheDocument();
        expect(screen.getByText('Elo: 1300')).toBeInTheDocument();
        expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
    });
});
