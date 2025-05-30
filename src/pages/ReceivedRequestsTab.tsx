import { Box, Typography, Stack, Button } from '@mui/material';
import UserCard from '../components/social/UserCard';
import { useReceivedFriendRequests } from '../hooks/useReceivedFriendRequests';
import { useAcceptFriendRequest } from '../hooks/useAcceptFriendRequest';
import { useRemoveFriend } from '../hooks/useRemoveFriend';

export default function ReceivedRequestsTab() {
    const { data: requests, isLoading } = useReceivedFriendRequests();
    const acceptRequest = useAcceptFriendRequest();
    const removeFriend = useRemoveFriend();

    if (isLoading) return <Typography>Loading received requests...</Typography>;
    if (!requests || requests.length === 0) return <Typography>No received friend requests.</Typography>;

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {requests.map((relation, index) => {
                const user = relation.firstUser;

                const handleAccept = () => {
                    acceptRequest.mutate(relation.id);
                };

                const handleReject = () => {
                    removeFriend.mutate(relation.id);
                };

                return (
                    <UserCard
                        key={user.uuid}
                        index={index + 1}
                        uuid={user.uuid}
                        username={user.username}
                        imageUrl={user.imageUrl}
                        createdAt={user.createdAt}
                        action={
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" color="primary" size="small" onClick={handleAccept}>
                                    Accept
                                </Button>
                                <Button variant="outlined" color="error" size="small" onClick={handleReject}>
                                    Reject
                                </Button>
                            </Stack>
                        }
                    />
                );
            })}
        </Box>
    );
}
