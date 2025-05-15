import { useReceivedFriendRequests } from '../hooks/useReceivedFriendRequests';
import { Box, Typography } from '@mui/material';
import UserCard from '../components/social/UserCard';

export default function ReceivedRequestsTab() {
    const { data: requests, isLoading } = useReceivedFriendRequests();

    if (isLoading) return <Typography>Loading received requests...</Typography>;
    if (!requests || requests.length === 0) return <Typography>No received friend requests.</Typography>;

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {requests.map((relation, index) => {
                const user = relation.firstUser;
                return (
                    <UserCard
                        key={user.uuid}
                        index={index + 1}
                        uuid={user.uuid}
                        username={user.username}
                        imageUrl={user.imageUrl}
                        createdAt={user.createdAt}
                    />
                );
            })}
        </Box>
    );
}
