import { useSentFriendRequests } from '../hooks/useSentFriendRequests';
import { Box, Typography } from '@mui/material';
import UserCard from '../components/social/UserCard';

export default function SentRequestsTab() {
    const { data: requests, isLoading } = useSentFriendRequests();

    if (isLoading) return <Typography>Loading sent requests...</Typography>;
    if (!requests || requests.length === 0) return <Typography>No sent friend requests.</Typography>;

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {requests.map((relation, index) => {
                const user = relation.secondUser;
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
