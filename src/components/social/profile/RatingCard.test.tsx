import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RatingCard from './RatingCard';
import { SportsEsports } from '@mui/icons-material';

describe('RatingCard', () => {
    it('renders label, icon, and rating correctly', () => {
        render(
            <RatingCard
                label="Bullet"
                icon={<SportsEsports data-testid="icon" />}
                rating={2000}
                showMatchButton={false}
            />
        );

        expect(screen.getByText('Bullet')).toBeInTheDocument();
        expect(screen.getByText('Elo Rating:')).toBeInTheDocument();
        expect(screen.getByText('2000')).toBeInTheDocument();
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders the "Match!" button when showMatchButton is true', () => {
        render(
            <RatingCard
                label="Blitz"
                icon={<SportsEsports />}
                rating={1800}
                showMatchButton={true}
            />
        );

        expect(screen.getByRole('button', { name: /match!/i })).toBeInTheDocument();
    });

    it('does not render the "Match!" button when showMatchButton is false', () => {
        render(
            <RatingCard
                label="Rapid"
                icon={<SportsEsports />}
                rating={1500}
                showMatchButton={false}
            />
        );

        expect(screen.queryByRole('button', { name: /match!/i })).not.toBeInTheDocument();
    });
});
