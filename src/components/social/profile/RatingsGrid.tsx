import { Grid } from '@mui/material';
import RatingCard from './RatingCard';
import { FlashOn, Speed, RocketLaunch } from '@mui/icons-material';

const MODES = [
    { value: 'bullet', label: 'Bullet', icon: <FlashOn fontSize="small" /> },
    { value: 'blitz', label: 'Blitz', icon: <Speed fontSize="small" /> },
    { value: 'rapid', label: 'Rapid', icon: <RocketLaunch fontSize="small" /> },
];

interface Props {
    ratings: Record<string, number>;
}

export default function RatingsGrid({ ratings }: Props) {
    return (
        <Grid container spacing={2} mt={3}>
            {MODES.map((mode) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={mode.value}>
                    <RatingCard
                        label={mode.label}
                        icon={mode.icon}
                        rating={ratings[mode.value] ?? 400}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
