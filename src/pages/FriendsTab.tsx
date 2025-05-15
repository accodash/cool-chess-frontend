import { useFriends } from '../hooks/useFriends';
import { Box, Typography } from '@mui/material';
import UserCard from '../components/social/UserCard'; // or your equivalent
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function FriendsTab() {
    const { data: friends, isLoading } = useFriends();
    const { data: currentUser } = useCurrentUser();

    if (isLoading) return <Typography>Loading friends...</Typography>;

    if (!friends || friends.length === 0) {
        return <Typography>No friends yet.</Typography>;
    }

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {friends.map((relation, index) => {
                const user = relation.firstUser.uuid === currentUser?.uuid ? relation.secondUser : relation.firstUser;
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
