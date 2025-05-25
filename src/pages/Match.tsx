import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import PageHeader from '../components/misc/PageHeader';
import { useMatch } from '../hooks/useMatch';
import { useCurrentUser } from '../hooks/useCurrentUser';
const pieceUnicode = {
    r: '/rb.png',
    n: '/nb.png',
    b: '/bb.png',
    q: '/qb.png',
    k: '/kb.png',
    p: '/pb.png',
    R: '/rw.png',
    N: '/nw.png',
    B: '/bw.png',
    Q: '/qw.png',
    K: '/kw.png',
    P: '/pw.png',
};

const allChars = 'rnbqkpRNBQKP';

function parseFEN(fen: string | undefined, color: 'white' | 'black') {
    if (!fen || !fen.includes(' ')) return;
    let [piecePlacement] = fen.split(' ');

    if (color == 'black') {
        piecePlacement = piecePlacement.split('').reverse().join();
    }

    const rows = piecePlacement.split('/');
    const board = [];

    for (let row of rows) {
        const boardRow = [];
        for (let char of row) {
            if (isNaN(Number(char))) {
                if (allChars.includes(char)) {
                    boardRow.push(pieceUnicode[char as keyof typeof pieceUnicode]);
                }
            } else {
                for (let i = 0; i < parseInt(char, 10); i++) {
                    boardRow.push(null);
                }
            }
        }
        board.push(boardRow);
    }

    return board;
}

function mapMove(colIndex: number, rowIndex: number, color: 'white' | 'black') {
    if (colIndex > 7 || rowIndex > 8) return;
    const LETTERS = color == 'white' ? 'abcdefgh' : 'hgfedcba';

    const colorRowIndex = color == 'white' ? rowIndex : 8 - rowIndex + 1;

    const mappedPosition = `${LETTERS[colIndex]}${colorRowIndex}`;

    console.log(mappedPosition);
}

export default function Match() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: currentUser } = useCurrentUser();

    if (!id) {
        return navigate('/play');
    }
    const { data, isLoading, isError } = useMatch(id);

    const usersColor = data?.blackPlayer.uuid == currentUser?.uuid ? 'black' : 'white';

    const fen = data?.boardState.board;
    const board = parseFEN(fen, usersColor);

    return (
        <Box px={4} py={6}>
            <PageHeader title={`Match ${id}`} />

            <Box
                display="grid"
                gridTemplateColumns="repeat(8, 60px)"
                gridTemplateRows="repeat(8, 60px)"
                border="2px solid black"
                mt={4}
            >
                {board &&
                    board.map((row, rowIndex) =>
                        row.map((image, colIndex) => {
                            const isDark = (rowIndex + colIndex) % 2 === 1;
                            return (
                                <Box
                                    key={`${rowIndex}-${colIndex}`}
                                    width={60}
                                    height={60}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontSize="32px"
                                    onClick={() => mapMove(colIndex, 8 - rowIndex, usersColor)}
                                    bgcolor={isDark ? '#769656' : '#eeeed2'}
                                >
                                    {image && <img src={image} />}
                                </Box>
                            );
                        })
                    )}
            </Box>
        </Box>
    );
}
