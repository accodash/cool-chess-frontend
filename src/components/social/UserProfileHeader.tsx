import { Avatar, Box, Button, Typography, Stack } from '@mui/material';
import { Person, Edit, PersonAdd } from '@mui/icons-material';
import { User } from '../../api/users';
import FollowStats from './FollowStats';

interface Props {
    user: User;
    isCurrentUser: boolean;
}

export default function UserProfileHeader({ user, isCurrentUser }: Props) {
    return (
        <Box display="flex" alignItems="center" gap={4} flexWrap="wrap">
            <Avatar src={user.imageUrl ?? undefined} sx={{ width: 100, height: 100 }}>
                {!user.imageUrl && <Person fontSize="large" />}
            </Avatar>

            <Stack spacing={1}>
                <Typography variant="h5">{user.username}</Typography>
                <FollowStats followers={user.followers?.length ?? 0} following={user.followed_users?.length ?? 0} />
            </Stack>

            <Box ml="auto">
                {isCurrentUser ? (
                    <Button variant="outlined" startIcon={<Edit />}>
                        Edit Profile
                    </Button>
                ) : (
                    <Button variant="contained" startIcon={<PersonAdd />}>
                        Follow
                    </Button>
                )}
            </Box>
        </Box>
    );
}
