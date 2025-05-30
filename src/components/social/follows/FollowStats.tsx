import { Button, Stack } from '@mui/material';

interface Props {
    followers: number;
    following: number;
    onFollowersClick: () => void;
    onFollowingsClick: () => void;
}

export default function FollowStats({ followers, following, onFollowersClick, onFollowingsClick }: Props) {
    return (
        <Stack direction="row" spacing={2}>
            <Button size="small" variant="outlined" onClick={onFollowersClick}>
                Followers: {followers}
            </Button>
            <Button size="small" variant="outlined" onClick={onFollowingsClick}>
                Following: {following}
            </Button>
        </Stack>
    );
}
