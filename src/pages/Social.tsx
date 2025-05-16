import { Tabs, Tab, Box } from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import PageHeader from '../components/misc/PageHeader';
import { useCurrentUser } from '../hooks/useCurrentUser';

const tabPaths = ['/social/friends', '/social/sent-requests', '/social/received-requests', '/social/all-users'];

export default function Social() {
    const navigate = useNavigate();
    const location = useLocation();

    const { data: currentUser } = useCurrentUser();

    const currentTab = tabPaths.findIndex((path) => location.pathname.startsWith(path));

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        navigate(tabPaths[newValue]);
    };

    return (
        <Box px={4} py={6}>
            <PageHeader title="Social" />

            {currentUser && (
                <Tabs value={currentTab === -1 ? 0 : currentTab} onChange={handleChange} sx={{ mb: 3 }}>
                    <Tab label="Friends" />
                    <Tab label="Sent requests" />
                    <Tab label="Received requests" />
                    <Tab label="List of users" />
                </Tabs>
            )}

            <Outlet />
        </Box>
    );
}
