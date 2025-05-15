import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    content: string;
    onClose: () => void;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmDialog({
    open,
    title,
    content,
    onClose,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}: ConfirmDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    {cancelText}
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
