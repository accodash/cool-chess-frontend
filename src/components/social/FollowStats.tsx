import { Button, Stack } from '@mui/material';

interface Props {
    followers: number;
    following: number;
}

export default function FollowStats({ followers, following }: Props) {
    return (
        <Stack direction="row" spacing={2}>
            <Button size="small" variant="outlined">
                Followers: {followers}
            </Button>
            <Button size="small" variant="outlined">
                Following: {following}
            </Button>
        </Stack>
    );
}
