import { Box } from '@mui/material';
import HomeHero from '../components/home/HomeHero';
import FeaturesSection from '../components/home/FeaturesSection';

export default function Home() {
    return (
        <Box>
            <HomeHero />
            <FeaturesSection />
        </Box>
    );
};
