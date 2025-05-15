import { useState } from 'react';
import { Avatar, Box, Button, Typography, Stack } from '@mui/material';
import { Person, Edit } from '@mui/icons-material';
import { User } from '../../api/users';
import FollowStats from './FollowStats';
import EditProfileDialog from './EditProfileDialog';
import { useFollowings } from '../../hooks/useFollowings';
import { useFollowers } from '../../hooks/useFollowers';
import FollowDialog from './FollowDialog';
import FollowActionButtons from './FollowActionButtons';
import FriendActionButtons from './FriendActionButtons';

interface Props {
    user: User;
    isCurrentUser: boolean;
}

export default function UserProfileHeader({ user, isCurrentUser }: Props) {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [showFollowings, setShowFollowings] = useState(false);
    const [showFollowers, setShowFollowers] = useState(false);
    const { data: followers } = useFollowers(user.uuid);
    const { data: followings } = useFollowings(user.uuid);

    return (
        <>
            <Box display="flex" alignItems="center" gap={4} flexWrap="wrap">
                <Avatar src={user.imageUrl ?? undefined} sx={{ width: 100, height: 100 }}>
                    {!user.imageUrl && <Person fontSize="large" />}
                </Avatar>

                <Stack spacing={1}>
                    <Typography variant="h5">{user.username}</Typography>
                    <FollowStats
                        followers={followers?.length ?? 0}
                        following={followings?.length ?? 0}
                        onFollowersClick={() => setShowFollowers(true)}
                        onFollowingsClick={() => setShowFollowings(true)}
                    />
                </Stack>

                <Box ml="auto" display="flex" flexDirection="column" rowGap={1}>
                    {isCurrentUser ? (
                        <Button variant="outlined" startIcon={<Edit />} onClick={() => setOpenEditDialog(true)}>
                            Edit Profile
                        </Button>
                    ) : (
                        <>
                            <FollowActionButtons userId={user.uuid} />
                            {/* <FriendActionButtons userId={user.uuid} /> */}
                        </>
                    )}
                </Box>
            </Box>

            {isCurrentUser && (
                <EditProfileDialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} user={user} />
            )}

            <FollowDialog
                open={showFollowers}
                onClose={() => setShowFollowers(false)}
                title="Followers"
                users={(followers ?? []).map((f) => f.follower!)}
            />

            <FollowDialog
                open={showFollowings}
                onClose={() => setShowFollowings(false)}
                title="Followings"
                users={(followings ?? []).map((f) => f.followedUser!)}
            />
        </>
    );
}
