export function getSquareCoords(square: string, color: 'white' | 'black'): [number, number] {
    const file = square[0];
    const rank = parseInt(square[1]);

    const col = 'abcdefgh'.indexOf(file);
    const row = 8 - rank;

    if (color === 'white') {
        return [row, col];
    } else {
        return [7 - row, 7 - col];
    }
}
