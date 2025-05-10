import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';

function App() {
    const { loginWithRedirect, user, logout, getAccessTokenSilently } =
        useAuth0();

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
    }, []);

    return (
        <BrowserRouter>
            <Box display='flex'>
                <NavigationBar
                    onLogin={loginWithRedirect}
                    onLogout={logout}
                    loggedIn={!!user}
                ></NavigationBar>
                <Box flex={1}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                    </Routes>
                </Box>
            </Box>
        </BrowserRouter>
    );
}

export default App;
