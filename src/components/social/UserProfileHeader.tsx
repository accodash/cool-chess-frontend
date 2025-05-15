import { useState } from 'react';
import { Avatar, Box, Button, Typography, Stack } from '@mui/material';
import { Person, Edit, PersonAdd, PersonRemove, AddReaction } from '@mui/icons-material';
import { User } from '../../api/users';
import FollowStats from './FollowStats';
import EditProfileDialog from './EditProfileDialog';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useFollowUser } from '../../hooks/useFollowUser';
import { useUnfollowUser } from '../../hooks/useUnfollowUser';
import { useFollowings } from '../../hooks/useFollowings';
import { useFollowers } from '../../hooks/useFollowers';
import FollowDialog from './FollowDialog';

interface Props {
    user: User;
    isCurrentUser: boolean;
}

export default function UserProfileHeader({ user, isCurrentUser }: Props) {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [showFollowings, setShowFollowings] = useState(false);
    const [showFollowers, setShowFollowers] = useState(false);

    const { data: currentUser } = useCurrentUser();
    const { data: currentUserFollowings } = useFollowings(currentUser?.uuid ?? '');
    const { data: followers } = useFollowers(user.uuid);
    const { data: followings } = useFollowings(user.uuid);

    const followMutation = useFollowUser();
    const unfollowMutation = useUnfollowUser();

    const isFollowing = currentUserFollowings?.some((f) => f.followedUser?.uuid === user.uuid);

    const handleFollow = () => followMutation.mutate(user.uuid);
    const handleUnfollow = () => unfollowMutation.mutate(user.uuid);

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
                    ) : !!currentUser && (
                        <>
                            {isFollowing ? (
                                <Button
                                    variant="outlined"
                                    startIcon={<PersonRemove />}
                                    onClick={handleUnfollow}
                                    disabled={unfollowMutation.isPending}
                                >
                                    Unfollow
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    startIcon={<PersonAdd />}
                                    onClick={handleFollow}
                                    disabled={followMutation.isPending}
                                >
                                    Follow
                                </Button>
                            )}
                            <Button variant="contained" startIcon={<AddReaction />}>
                                Add friend
                            </Button>
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
