export function calculateWinner(squares, setWinnerMove) {
    const boardSize = 3;
    for (let i = 0; i < boardSize; i++) {
        const row = i * boardSize;
        // Check row
        if (squares[row] && squares[row] === squares[row + 1] && squares[row] === squares[row + 2]) {
            setWinnerMove([row, row + 1, row + 2]);
            return squares[row];
        }
        // Check column
        if (squares[i] && squares[i] === squares[i + boardSize] && squares[i] === squares[i + boardSize * 2]) {
            setWinnerMove([i, i + boardSize, i + boardSize * 2]);
            return squares[i];
        }
    }
    // Check diagonals
    if (squares[0] && squares[0] === squares[4] && squares[0] === squares[8]) {
        setWinnerMove([0, 4, 8]);
        return squares[0];
    }
    if (squares[2] && squares[2] === squares[4] && squares[2] === squares[6]) {
        setWinnerMove([2, 4, 6]);
        return squares[2];
    }
    return null;
}

export function checkDraw(squares) {
    return squares.every((square) => square !== null);
}