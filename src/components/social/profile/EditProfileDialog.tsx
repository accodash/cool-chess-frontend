import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Avatar,
    Stack,
    CircularProgress,
} from '@mui/material';
import { Save, Cancel, UploadFile } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { User } from '../../../api/users';
import { useUpdateCurrentUser } from '../../../hooks/useUpdateCurrentUser';
import { useUploadAvatar } from '../../../hooks/useUploadAvatar';

interface Props {
    open: boolean;
    onClose: () => void;
    user: User;
}

export default function EditProfileDialog({ open, onClose, user }: Props) {
    const [username, setUsername] = useState(user.username);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.imageUrl);
    const [file, setFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateMutation = useUpdateCurrentUser();
    const uploadMutation = useUploadAvatar();

    useEffect(() => {
        if (open) {
            setUsername(user.username);
            setAvatarPreview(user.imageUrl);
            setFile(null);
        }
    }, [open, user]);

    const handleSave = async () => {
        try {
            let uploadedUrl = user.imageUrl;

            if (file) {
                uploadedUrl = await uploadMutation.mutateAsync(file);
                setAvatarPreview(uploadedUrl);
            }

            await updateMutation.mutateAsync({
                username,
                imageUrl: uploadedUrl,
            });

            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const previewUrl = URL.createObjectURL(selectedFile);
            setAvatarPreview(previewUrl);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Edit your profile</DialogTitle>
            <DialogContent>
                <Stack spacing={3} mt={2} alignItems="center">
                    <Avatar src={avatarPreview ?? undefined} sx={{ width: 100, height: 100 }} alt='avatar' />

                    <Button variant="outlined" startIcon={<UploadFile />} onClick={() => fileInputRef.current!!.click()}>
                        Upload Avatar
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                        data-testid="hidden-file-input"
                    />

                    <TextField
                        label="Username"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} startIcon={<Cancel />} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    startIcon={<Save />}
                    variant="contained"
                    disabled={updateMutation.isPending || uploadMutation.isPending}
                >
                    {updateMutation.isPending || uploadMutation.isPending ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        'Save'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
