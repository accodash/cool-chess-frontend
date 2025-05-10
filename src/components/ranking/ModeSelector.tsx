import { Chip, Stack } from '@mui/material';
import { FlashOn, Speed, RocketLaunch } from '@mui/icons-material';

const MODES = [
    { value: 'bullet', label: 'Bullet', icon: <FlashOn fontSize='small' /> },
    { value: 'blitz', label: 'Blitz', icon: <Speed fontSize='small' /> },
    { value: 'rapid', label: 'Rapid', icon: <RocketLaunch fontSize='small' /> },
];

interface ModeSelectorProps {
    selectedMode: string;
    onSelect: (mode: string) => void;
}

export default function ModeSelector({
    selectedMode,
    onSelect,
}: ModeSelectorProps) {
    return (
        <Stack direction='row' spacing={1} mb={3}>
            {MODES.map((m) => (
                <Chip
                    key={m.value}
                    icon={m.icon}
                    label={m.label}
                    clickable
                    color={selectedMode === m.value ? 'primary' : 'default'}
                    onClick={() => onSelect(m.value)}
                />
            ))}
        </Stack>
    );
}
