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
            />
        );

        expect(screen.getByText('Bullet')).toBeInTheDocument();
        expect(screen.getByText('Elo Rating:')).toBeInTheDocument();
        expect(screen.getByText('2000')).toBeInTheDocument();
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
});
