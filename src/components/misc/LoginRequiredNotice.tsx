import { Box, Typography } from '@mui/material';
import { EmojiPeople } from '@mui/icons-material';

export default function LoginRequiredNotice() {
    return (
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            minHeight='60vh'
            textAlign='center'
            px={3}
        >
            <EmojiPeople sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant='h5' gutterBottom>
                Hey there!
            </Typography>
            <Typography variant='body1' color='text.secondary'>
                To see this page, you'll need to log in.
                <br />
                We'd love to have you join us!
            </Typography>
        </Box>
    );
}
