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
        render(<RatingsGrid ratings={ratings} />);

        expect(screen.getByText('Bullet')).toBeInTheDocument();
        expect(screen.getByText('Blitz')).toBeInTheDocument();
        expect(screen.getByText('Rapid')).toBeInTheDocument();

        expect(screen.getByText('1500')).toBeInTheDocument();
        expect(screen.getByText('1600')).toBeInTheDocument();
        expect(screen.getByText('1700')).toBeInTheDocument();
    });

    it('falls back to default rating (400) when missing rating value', () => {
        render(<RatingsGrid ratings={{}} />);

        expect(screen.getByText('Bullet')).toBeInTheDocument();
        expect(screen.getByText('Blitz')).toBeInTheDocument();
        expect(screen.getByText('Rapid')).toBeInTheDocument();

        const ratingElements = screen.getAllByText('400');
        expect(ratingElements.length).toBe(3);
    });
});
