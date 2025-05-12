import { Typography, SxProps, Theme } from '@mui/material';

interface PageHeaderProps {
    title: string;
    sx?: SxProps<Theme>;
}

export default function PageHeader({ title, sx }: PageHeaderProps) {
    return (
        <Typography variant="h4" gutterBottom sx={sx}>
            {title}
        </Typography>
    );
}
