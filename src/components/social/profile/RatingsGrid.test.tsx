import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RatingsGrid from './RatingsGrid';

describe('RatingsGrid', () => {
    const ratings = {
        bullet: 1500,
        blitz: 1600,
        rapid: 1700,
    };

    it('renders all three RatingCards with correct data', () => {
        render(<RatingsGrid ratings={ratings} showMatchButton={false} />);

        expect(screen.getByText('Bullet')).toBeInTheDocument();
        expect(screen.getByText('Blitz')).toBeInTheDocument();
        expect(screen.getByText('Rapid')).toBeInTheDocument();

        expect(screen.getByText('1500')).toBeInTheDocument();
        expect(screen.getByText('1600')).toBeInTheDocument();
        expect(screen.getByText('1700')).toBeInTheDocument();
    });

    it('falls back to default rating (1000) when missing rating value', () => {
        render(<RatingsGrid ratings={{}} showMatchButton={false} />);

        expect(screen.getByText('Bullet')).toBeInTheDocument();
        expect(screen.getByText('Blitz')).toBeInTheDocument();
        expect(screen.getByText('Rapid')).toBeInTheDocument();

        const ratingElements = screen.getAllByText('1000');
        expect(ratingElements.length).toBe(3);
    });

    it('renders Match button on all cards if showMatchButton is true', () => {
        render(<RatingsGrid ratings={ratings} showMatchButton={true} />);

        const matchButtons = screen.getAllByRole('button', { name: /match!/i });
        expect(matchButtons.length).toBe(3);
    });

    it('does not render Match button if showMatchButton is false', () => {
        render(<RatingsGrid ratings={ratings} showMatchButton={false} />);

        expect(screen.queryByRole('button', { name: /match!/i })).not.toBeInTheDocument();
    });
});
