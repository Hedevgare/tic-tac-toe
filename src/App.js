import { useState } from "react";

export default function Board() {
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [winnerMove, setWinnerMove] = useState(Array(3).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [status, setStatus] = useState('Next player: ' + (xIsNext ? 'X' : 'O'));
    const [xScore, setXScore] = useState(0);
    const [oScore, setOScore] = useState(0);

    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) return;
        const newSquares = squares.slice();
        xIsNext ? newSquares[i] = 'X' : newSquares[i] = 'O';
        setXIsNext(!xIsNext);
        setSquares(newSquares);
        updateStatus(newSquares, !xIsNext);
    }

    function calculateWinner(squares) {
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
            // Check diagonals
            if (squares[0] && squares[0] === squares[4] && squares[0] === squares[8]) {
                setWinnerMove([0, 4, 8]);
                return squares[0];
            }
            if (squares[2] && squares[2] === squares[4] && squares[2] === squares[6]) {
                setWinnerMove([2, 4, 6]);
                return squares[2];
            }
        }
    }

    function checkDraw(squares) {
        return squares.every((square) => square !== null);
    }

    function resetBoard() {
        setSquares(Array(9).fill(null));
        setXIsNext(xIsNext ? true : false);
        setStatus('Next player: ' + (xIsNext ? 'X' : 'O'));
        setWinnerMove(Array(3).fill(null));
    }

    function updateStatus(squares, xIsNext) {
        const winner = calculateWinner(squares);
        let status;

        if (winner) {
            status = 'Winner: ' + winner;
            winner === 'X' ? setXScore(xScore + 1) : setOScore(oScore + 1);
        } else if (checkDraw(squares)) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
        setStatus(status);
    }

    return (
        <>
            <div className="status">
                <p className="status-score">
                    <span>X</span>{`: ${xScore} - ${oScore} :`}<span>O</span>
                </p>
                <p className="status-info">{status}</p>
            </div>
            <div className="board">
                <div className="board-row">
                    <Square isWinner={winnerMove.includes(0)} value={squares[0]} onSquareClick={() => handleClick(0)} />
                    <Square isWinner={winnerMove.includes(1)} value={squares[1]} onSquareClick={() => handleClick(1)} />
                    <Square isWinner={winnerMove.includes(2)} value={squares[2]} onSquareClick={() => handleClick(2)} />
                </div>
                <div className="board-row">
                    <Square isWinner={winnerMove.includes(3)} value={squares[3]} onSquareClick={() => handleClick(3)} />
                    <Square isWinner={winnerMove.includes(4)} value={squares[4]} onSquareClick={() => handleClick(4)} />
                    <Square isWinner={winnerMove.includes(5)} value={squares[5]} onSquareClick={() => handleClick(5)} />
                </div>
                <div className="board-row">
                    <Square isWinner={winnerMove.includes(6)} value={squares[6]} onSquareClick={() => handleClick(6)} />
                    <Square isWinner={winnerMove.includes(7)} value={squares[7]} onSquareClick={() => handleClick(7)} />
                    <Square isWinner={winnerMove.includes(8)} value={squares[8]} onSquareClick={() => handleClick(8)} />
                </div>
                {<div onClick={resetBoard}>
                    <p className="board-reset-btn">Restart</p>
                </div>}
            </div>
        </>
    );
}

function Square({ value, onSquareClick, isWinner }) {
    const winnerClass = isWinner ? 'winner' : '';
    return (
        <button className={`square ${winnerClass}`} onClick={onSquareClick}>{value}</button>
    );
}