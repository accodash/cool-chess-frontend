import { Button, Stack } from '@mui/material';
import { useFriends } from '../../hooks/useFriends';
import { useReceivedFriendRequests } from '../../hooks/useReceivedFriendRequests';
import { useSentFriendRequests } from '../../hooks/useSentFriendRequests';
import { useSendFriendRequest } from '../../hooks/useSendFriendRequest';
import { useAcceptFriendRequest } from '../../hooks/useAcceptFriendRequest';
import { useRemoveFriend } from '../../hooks/useRemoveFriend';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import ConfirmDialog from '../misc/ConfirmDialog';
import { useState } from 'react';

interface Props {
    userId: string;
}

export default function FriendActionButtons({ userId }: Props) {
    const { data: currentUser } = useCurrentUser();
    const { data: friends } = useFriends();
    const { data: receivedRequests } = useReceivedFriendRequests();
    const { data: sentRequests } = useSentFriendRequests();

    const sendRequest = useSendFriendRequest();
    const acceptRequest = useAcceptFriendRequest();
    const removeFriend = useRemoveFriend();

    const [confirmOpen, setConfirmOpen] = useState(false);

    if (!currentUser || currentUser.uuid === userId) return null;

    const friendRelation = friends?.find(
        (relation) => relation.firstUser.uuid === userId || relation.secondUser.uuid === userId
    );
    const isFriend = !!friendRelation?.befriendedAt;

    const receivedRequest = receivedRequests?.find(
        (relation) => relation.firstUser.uuid === userId && !relation.befriendedAt
    );

    const sentRequest = sentRequests?.find((relation) => relation.secondUser.uuid === userId && !relation.befriendedAt);

    const handleSendRequest = () => {
        sendRequest.mutate(userId);
    };

    const handleRemoveRequest = () => {
        if (sentRequest) removeFriend.mutate(sentRequest.id);
    };

    const handleAcceptRequest = () => {
        if (receivedRequest) acceptRequest.mutate(receivedRequest.id);
    };

    const handleRejectRequest = () => {
        if (receivedRequest) removeFriend.mutate(receivedRequest.id);
    };

    const handleRemoveFriend = () => {
        if (friendRelation) removeFriend.mutate(friendRelation.id);
    };

    return (
        <Stack direction="row" spacing={1}>
            {isFriend ? (
                <>
                    <Button variant="outlined" onClick={() => setConfirmOpen(true)}>
                        Remove friend
                    </Button>
                    <ConfirmDialog
                        open={confirmOpen}
                        title="Remove Friend"
                        content="Are you sure you want to remove this friend?"
                        onClose={() => setConfirmOpen(false)}
                        onConfirm={handleRemoveFriend}
                    />
                </>
            ) : receivedRequest ? (
                <>
                    <Button variant="contained" onClick={handleAcceptRequest}>
                        Accept friend request
                    </Button>
                    <Button variant="outlined" onClick={handleRejectRequest}>
                        Reject friend request
                    </Button>
                </>
            ) : sentRequest ? (
                <Button variant="outlined" onClick={handleRemoveRequest}>
                    Cancel friend request
                </Button>
            ) : (
                <Button variant="contained" onClick={handleSendRequest}>
                    Add friend
                </Button>
            )}
        </Stack>
    );
}
