import { IconButton, Stack, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

interface PaginationProps {
    page: number;
    hasNext: boolean;
    onChange: (delta: number) => void;
}

export default function PaginationControls({ page, hasNext, onChange }: PaginationProps) {
    return (
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} mt={4}>
            <IconButton disabled={page <= 1} onClick={() => onChange(-1)} aria-label="Previous page">
                <ArrowBack />
            </IconButton>

            <Typography variant="body1">Page {page}</Typography>

            <IconButton disabled={!hasNext} onClick={() => onChange(1)} aria-label="Next page">
                <ArrowForward />
            </IconButton>
        </Stack>
    );
}
