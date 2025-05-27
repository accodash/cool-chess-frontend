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

export function parseFEN(fen: string | undefined, color: 'white' | 'black'): (string | null)[][] | undefined {
    if (!fen || !fen.includes(' ')) return;
    let [piecePlacement] = fen.split(' ');

    if (color === 'black') {
        piecePlacement = piecePlacement.split('').reverse().join('');
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
