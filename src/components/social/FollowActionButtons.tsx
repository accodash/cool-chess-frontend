import { Button } from '@mui/material';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useFollowings } from '../../hooks/useFollowings';
import { useFollowUser } from '../../hooks/useFollowUser';
import { useUnfollowUser } from '../../hooks/useUnfollowUser';

interface Props {
    userId: string;
}

export default function FollowActionButtons({ userId }: Props) {
    const { data: currentUser } = useCurrentUser();
    const { data: followings } = useFollowings(currentUser?.uuid ?? '');

    const followMutation = useFollowUser();
    const unfollowMutation = useUnfollowUser();

    const isFollowing = followings?.some((relation) => relation.followedUser?.uuid === userId);

    const handleFollow = () => {
        followMutation.mutate(userId);
    };

    const handleUnfollow = () => {
        unfollowMutation.mutate(userId);
    };

    if (!currentUser || currentUser.uuid === userId) return null;

    return isFollowing ? (
        <Button variant="outlined" onClick={handleUnfollow} disabled={unfollowMutation.isPending}>
            Unfollow
        </Button>
    ) : (
        <Button variant="contained" onClick={handleFollow} disabled={followMutation.isPending}>
            Follow
        </Button>
    );
}
