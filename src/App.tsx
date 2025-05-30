import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/misc/NavigationBar';
import Home from './pages/Home';
import Footer from './components/misc/Footer';
import Ranking from './pages/Ranking';
import CTASection from './components/misc/CTASection';
import Lobby from './pages/Lobby';
import History from './pages/History';
import UserProfile from './pages/UserProfile';
import Social from './pages/Social';
import UserListTab from './pages/UserListTab';
import FriendsTab from './pages/FriendsTab';
import SentRequestsTab from './pages/SentRequestsTab';
import ReceivedRequestsTab from './pages/ReceivedRequestsTab';
import { useCurrentUser } from './hooks/useCurrentUser';

function App() {
    const { data: currentUser } = useCurrentUser();

    return (
        <BrowserRouter>
            <Box display="flex">
                <NavigationBar></NavigationBar>
                <Box flex={1}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/play" element={<Lobby />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/ranking" element={<Ranking />} />
                        <Route path="/social" element={<Social />}>
                            <Route path="friends" element={<FriendsTab />} />
                            <Route path="sent-requests" element={<SentRequestsTab />} />
                            <Route path="received-requests" element={<ReceivedRequestsTab />} />
                            <Route path="all-users" element={<UserListTab />} />
                        </Route>
                        <Route path="/social/user/:id" element={<UserProfile />} />
                    </Routes>
                    {!currentUser && <CTASection />}
                    <Footer />
                </Box>
            </Box>
        </BrowserRouter>
    );
}

export default App;
