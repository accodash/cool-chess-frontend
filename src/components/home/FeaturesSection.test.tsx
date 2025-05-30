import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeaturesSection from './FeaturesSection';

describe('FeaturesSection', () => {
    beforeEach(() => {
        render(<FeaturesSection />);
    });

    it('renders the main heading', () => {
        expect(screen.getByRole('heading', { name: /why choose us\?/i })).toBeInTheDocument();
    });

    it('renders all feature titles and descriptions', () => {
        const titles = ['Play instantly', 'Play with friends', 'Track your progress'];

        const descriptions = [
            'Jump into a game with no downloads required.',
            'Invite and play casual or rated matches with your friends.',
            'Elo ratings, leaderboards, and game history.',
        ];

        titles.forEach((title) => {
            expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
        });

        descriptions.forEach((desc) => {
            expect(screen.getByText(desc)).toBeInTheDocument();
        });
    });

    it('renders the icons', () => {
        expect(screen.getByTestId('SportsEsportsIcon')).toBeInTheDocument();
        expect(screen.getByTestId('PeopleIcon')).toBeInTheDocument();
        expect(screen.getByTestId('LeaderboardIcon')).toBeInTheDocument();
    });

    it('renders 3 feature papers', () => {
        const papers = screen.getAllByText(/play instantly|play with friends|track your progress/i);
        expect(papers.length).toBe(3);
    });
});
