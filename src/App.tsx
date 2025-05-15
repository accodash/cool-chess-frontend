import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
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

function App() {
    const { loginWithRedirect, user, logout, getAccessTokenSilently, isLoading, isAuthenticated } = useAuth0();

    const fetchProtectedData = async () => {
        try {
            const token = await getAccessTokenSilently();

            const response = await fetch(import.meta.env.VITE_BACKEND_URL, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchProtectedData();
    }, [isLoading, isAuthenticated]);

    return (
        <BrowserRouter>
            <Box display="flex">
                <NavigationBar onLogin={loginWithRedirect} onLogout={logout}></NavigationBar>
                <Box flex={1}>
                    <Routes>
                        <Route path="/" element={<Home loggedIn={!!user} onLogin={loginWithRedirect} />} />
                        <Route path="/play" element={<Lobby loggedIn={!!user} />} />
                        <Route path="/history" element={<History loggedIn={!!user} />} />
                        <Route path="/ranking" element={<Ranking />} />
                        <Route path="/social" element={<Social />}>
                            <Route path="friends" element={<FriendsTab />} />
                            <Route path="sent-requests" element={<SentRequestsTab />} />
                            <Route path="received-requests" element={<ReceivedRequestsTab />} />
                            <Route path="all-users" element={<UserListTab />} />
                        </Route>
                        <Route path="/social/user/:id" element={<UserProfile />} />
                    </Routes>
                    {!user && <CTASection onLogin={loginWithRedirect} />}
                    <Footer />
                </Box>
            </Box>
        </BrowserRouter>
    );
}

export default App;
