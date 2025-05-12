import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';

interface UserListControlsProps {
    search: string;
    sortBy: string;
    order: string;
    onSearchChange: (value: string) => void;
    onSortChange: (sortBy: string, order: string) => void;
}

type SortOption = {
    label: string;
    sortBy: string;
    order: string;
};

const sortOptions: SortOption[] = [
    { label: 'Name (A-Z)', sortBy: 'username', order: 'ASC' },
    { label: 'Name (Z-A)', sortBy: 'username', order: 'DESC' },
    { label: 'Joined (Oldest)', sortBy: 'createdAt', order: 'ASC' },
    { label: 'Joined (Newest)', sortBy: 'createdAt', order: 'DESC' },
];

export default function UserListControls({
    search,
    sortBy,
    order,
    onSearchChange,
    onSortChange,
}: UserListControlsProps) {
    return (
        <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
            <TextField
                label="Search by username"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                sx={{ flex: 1, minWidth: 240 }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <FormControl sx={{ minWidth: 220 }}>
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                    labelId="sort-label"
                    value={`${sortBy}-${order}`}
                    label="Sort By"
                    onChange={(e: SelectChangeEvent) => {
                        const [newSort, newOrder] = e.target.value.split('-');
                        onSortChange(newSort, newOrder);
                    }}
                >
                    {sortOptions.map((option) => (
                        <MenuItem key={`${option.sortBy}-${option.order}`} value={`${option.sortBy}-${option.order}`}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
