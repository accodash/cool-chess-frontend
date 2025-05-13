import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
    label: string;
    icon: ReactNode;
    rating: number;
    showMatchButton: boolean;
}

export default function RatingCard({ label, icon, rating, showMatchButton }: Props) {
    return (
        <Card sx={{ minWidth: 200 }}>
            <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {icon}
                    <Typography variant="h6">{label}</Typography>
                </Box>
                <Typography variant="body1">Rating: {rating}</Typography>
                {showMatchButton && (
                    <Button variant="contained" size="small" sx={{ mt: 1 }}>
                        Match!
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
