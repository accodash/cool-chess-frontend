import { Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
    label: string;
    icon: ReactNode;
    rating: number;
    showMatchButton: boolean;
}

export default function RatingCard({ label, icon, rating, showMatchButton }: Props) {
    return (
        <Card
            elevation={4}
        >
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    {icon}
                    <Typography variant="h6" fontWeight="bold">
                        {label}
                    </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" mb={1}>
                    Elo Rating:
                </Typography>
                <Typography variant="h5" fontWeight="medium">
                    {rating}
                </Typography>

                {showMatchButton && (
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
                        fullWidth
                    >
                        Match!
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
