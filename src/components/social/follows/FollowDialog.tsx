import { Dialog, DialogTitle, DialogContent, Stack, Typography } from '@mui/material';
import UserCard from '../UserCard';
import { User } from '../../../api/users';

interface FollowDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    users: User[];
}

export default function FollowDialog({ open, onClose, title, users }: FollowDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {title} ({users.length})
            </DialogTitle>
            <DialogContent dividers sx={{ maxHeight: 400 }}>
                <Stack spacing={2}>
                    {users.map((user, index) => (
                        <UserCard
                            key={user.uuid}
                            index={index + 1}
                            uuid={user.uuid}
                            username={user.username}
                            imageUrl={user.imageUrl}
                            createdAt={user.createdAt}
                        />
                    ))}
                    {users.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                            No users to display.
                        </Typography>
                    )}
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
