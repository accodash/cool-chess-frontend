import { Box, Typography, Button } from '@mui/material';
import { useSentFriendRequests } from '../hooks/useSentFriendRequests';
import { useRemoveFriend } from '../hooks/useRemoveFriend';
import UserCard from '../components/social/UserCard';

export default function SentRequestsTab() {
    const { data: requests, isLoading } = useSentFriendRequests();
    const removeFriend = useRemoveFriend();

    if (isLoading) return <Typography>Loading sent requests...</Typography>;
    if (!requests || requests.length === 0) return <Typography>No sent friend requests.</Typography>;

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {requests.map((relation, index) => {
                const user = relation.secondUser;

                const handleCancelRequest = () => {
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
                            <Button variant="outlined" color="error" size="small" onClick={handleCancelRequest}>
                                Cancel request
                            </Button>
                        }
                    />
                );
            })}
        </Box>
    );
}
