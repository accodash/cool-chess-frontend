import {
    Box,
    Button,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Snackbar,
} from '@mui/material';
import LoginRequiredNotice from '../components/misc/LoginRequiredNotice';
import PageHeader from '../components/misc/PageHeader';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useState } from 'react';
import { useMatchmaking } from '../hooks/useMatchmaking';
import { useNavigate } from 'react-router-dom';

const gamemodes = [{ gamemode: 'Rapid' }, { gamemode: 'Bullet' }, { gamemode: 'Blitz' }];

export default function Lobby() {
    const { data: currentUser } = useCurrentUser();

    if (!currentUser) {
        return (
            <Box px={4} py={6}>
                <PageHeader title="Game Lobby" />
                <LoginRequiredNotice />
            </Box>
        );
    }

    const [ranked, setRanked] = useState(false);
    let navigate = useNavigate();
    const [gamemode, setGamemode] = useState(gamemodes[0].gamemode);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { startMatchmaking } = useMatchmaking((matchData) => {
        navigate(`/match/${matchData.gameId}`);
    });

    const handleGamemodeSelect = (event: SelectChangeEvent) => {
        setGamemode(event.target.value as string);
    };

    const handleStartGame = () => {
        if (!currentUser.uuid) return;
        setSnackbarOpen(true);
        startMatchmaking(currentUser.uuid, gamemode.toLowerCase(), ranked);
    };

    return (
        <Box px={4} py={6}>
            <PageHeader title="Game Lobby" />
            <Box display="flex" flexDirection="column" maxWidth={400} gap={2} pt={2}>
                <FormControl>
                    <InputLabel id="gamemode-select">Gamemode</InputLabel>
                    <Select
                        labelId="gamemode-select"
                        id="gamemode"
                        value={gamemode}
                        label="Gamemode"
                        onChange={handleGamemodeSelect}
                    >
                        {gamemodes.map((mode) => (
                            <MenuItem key={mode.gamemode} value={mode.gamemode}>
                                {mode.gamemode}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={<Checkbox onChange={() => setRanked((prev) => !prev)} checked={ranked} />}
                    label="Ranked?"
                />
                <Button variant="contained" color="primary" size="large" onClick={handleStartGame}>
                    Find a game
                </Button>
            </Box>
            <Snackbar
                open={snackbarOpen}
                message="Matchmaking is in progress..."
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
        </Box>
    );
}
