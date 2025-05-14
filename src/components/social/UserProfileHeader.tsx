import { useState } from 'react';
import { Avatar, Box, Button, Typography, Stack } from '@mui/material';
import { Person, Edit, PersonAdd, AddReaction } from '@mui/icons-material';
import { User } from '../../api/users';
import FollowStats from './FollowStats';
import EditProfileDialog from './EditProfileDialog';

interface Props {
    user: User;
    isCurrentUser: boolean;
}

export default function UserProfileHeader({ user, isCurrentUser }: Props) {
    const [openEditDialog, setOpenEditDialog] = useState(false);

    return (
        <>
            <Box display="flex" alignItems="center" gap={4} flexWrap="wrap">
                <Avatar src={user.imageUrl ?? undefined} sx={{ width: 100, height: 100 }}>
                    {!user.imageUrl && <Person fontSize="large" />}
                </Avatar>

                <Stack spacing={1}>
                    <Typography variant="h5">{user.username}</Typography>
                    <FollowStats followers={user.followers?.length ?? 0} following={user.followed_users?.length ?? 0} />
                </Stack>

                <Box ml="auto" display="flex" flexDirection="column" rowGap={1}>
                    {isCurrentUser ? (
                        <Button variant="outlined" startIcon={<Edit />} onClick={() => setOpenEditDialog(true)}>
                            Edit Profile
                        </Button>
                    ) : (
                        <>
                            <Button variant="contained" startIcon={<PersonAdd />}>
                                Follow
                            </Button>
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
        </>
    );
}
