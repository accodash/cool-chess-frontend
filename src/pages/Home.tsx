import { Box } from '@mui/material';
import HomeHero from '../components/HomeHero';
import FeaturesSection from '../components/FeaturesSection';
import CTASection from '../components/CTASection';

export default function Home() {
  return (
    <Box>
      <HomeHero />
      <FeaturesSection />
      <CTASection />
    </Box>
  );
}
