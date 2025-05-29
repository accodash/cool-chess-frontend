import { Box, Button, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem } from '@mui/material';
import LoginRequiredNotice from '../components/misc/LoginRequiredNotice';
import PageHeader from '../components/misc/PageHeader';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useState } from 'react';
import { useMatchmaking } from '../hooks/useMatchmaking'; // Import hook
import { useNavigate } from 'react-router-dom';

const gamemodes = [{ gamemode: 'Rapid' }, { gamemode: 'Bullet' }, { gamemode: 'Blitz' }];

export default function Lobby() {
    const { data: currentUser } = useCurrentUser();
    let navigate = useNavigate();
    const [gamemode, setGamemode] = useState(gamemodes[0].gamemode);
    const { startMatchmaking } = useMatchmaking((matchData) => {
        navigate(`/match/${matchData.gameId}`);
    });

    console.log(currentUser);
    const handleGamemodeSelect = (event: SelectChangeEvent) => {
        setGamemode(event.target.value as string);
    };

    const handleStartGame = () => {
        if (!currentUser?.uuid) return;
        startMatchmaking(currentUser.uuid, gamemode.toLowerCase());
    };

    if (!currentUser) {
        return (
            <Box px={4} py={6}>
                <PageHeader title="Game Lobby" />
                <LoginRequiredNotice />
            </Box>
        );
    }

    return (
        <Box px={4} py={6}>
            <PageHeader title="Game Lobby" />
            <Box display="flex" flexDirection="column" maxWidth={300} gap={2}>
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

                <Button variant="contained" color="primary" size="large" onClick={handleStartGame}>
                    Start the game
                </Button>
            </Box>
        </Box>
    );
}
