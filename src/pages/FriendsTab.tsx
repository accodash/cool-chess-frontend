import { Box, Typography, Button } from '@mui/material';
import { useFriends } from '../hooks/useFriends';
import { useRemoveFriend } from '../hooks/useRemoveFriend';
import { useCurrentUser } from '../hooks/useCurrentUser';
import ConfirmDialog from '../components/misc/ConfirmDialog';
import UserCard from '../components/social/UserCard';
import { useState } from 'react';

export default function FriendsTab() {
    const { data: friends, isLoading } = useFriends();
    const { data: currentUser } = useCurrentUser();
    const removeFriend = useRemoveFriend();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedRelationId, setSelectedRelationId] = useState<string | null>(null);

    if (isLoading) return <Typography>Loading friends...</Typography>;
    if (!friends || friends.length === 0) return <Typography>No friends yet.</Typography>;

    const handleConfirmRemove = () => {
        if (selectedRelationId) {
            removeFriend.mutate(selectedRelationId);
            setConfirmOpen(false);
        }
    };

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
                        action={
                            <>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                        setSelectedRelationId(relation.id);
                                        setConfirmOpen(true);
                                    }}
                                >
                                    Remove friend
                                </Button>
                                <ConfirmDialog
                                    open={confirmOpen && selectedRelationId === relation.id}
                                    title="Remove Friend"
                                    content={`Are you sure you want to remove ${user.username} as a friend?`}
                                    onClose={() => setConfirmOpen(false)}
                                    onConfirm={handleConfirmRemove}
                                />
                            </>
                        }
                    />
                );
            })}
        </Box>
    );
}
