import { Box } from '@mui/material';
import HomeHero from '../components/home/HomeHero';
import FeaturesSection from '../components/home/FeaturesSection';

interface HomeProps {
    loggedIn: boolean;
    onLogin: () => void;
}

const Home: React.FC<HomeProps> = ({ loggedIn, onLogin }) => {
    return (
        <Box>
            <HomeHero loggedIn={loggedIn} onLogin={onLogin} />
            <FeaturesSection />
        </Box>
    );
};

export default Home;
