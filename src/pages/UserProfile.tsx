import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import PageHeader from '../components/misc/PageHeader';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useUserById } from '../hooks/useUserById';
import UserProfileHeader from '../components/social/profile/UserProfileHeader';
import RatingsGrid from '../components/social/profile/RatingsGrid';

export default function UserProfile() {
    const { id } = useParams();
    const { data: currentUser } = useCurrentUser();
    const { data: profileUser, isLoading } = useUserById(id || '');

    if (!profileUser || isLoading) return null;

    const isCurrentUser = currentUser?.uuid === profileUser.uuid;

    const ratings: Record<string, number> = {};
    profileUser.ratings?.forEach((r) => (ratings[r.mode] = r.rating));

    return (
        <Box px={4} py={6}>
            <PageHeader title="User Profile" />
            <UserProfileHeader user={profileUser} isCurrentUser={isCurrentUser} />
            <RatingsGrid ratings={ratings} showMatchButton={!isCurrentUser} />
        </Box>
    );
}
