import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';

jest.mock('../components/home/HomeHero', () => () => <div data-testid="home-hero">HomeHero</div>);
jest.mock('../components/home/FeaturesSection', () => () => <div data-testid="features-section">FeaturesSection</div>);

describe('Home', () => {
    it('renders HomeHero and FeaturesSection', () => {
        render(<Home />);
        
        expect(screen.getByTestId('home-hero')).toBeInTheDocument();
        expect(screen.getByTestId('features-section')).toBeInTheDocument();
    });
});
