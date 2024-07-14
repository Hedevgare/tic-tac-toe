import { useState } from "react";
import Square from "./Square";
import { calculateWinner, checkDraw } from "../utils/game";

export default function Board() {
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [winnerMove, setWinnerMove] = useState(Array(3).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [canPlay, setCanPlay] = useState(true);
    const [status, setStatus] = useState('Next player: ' + (xIsNext ? 'X' : 'O'));
    const [xScore, setXScore] = useState(0);
    const [oScore, setOScore] = useState(0);

    function handleClick(i) {
        if (!canPlay) return;
        if (squares[i] || calculateWinner(squares, setWinnerMove)) return;
        setCanPlay(false);
        const newSquares = squares.slice();
        playerPlay(newSquares, i);
        computerPlay(newSquares);
    }

    function playerPlay(availableSquares, index) {
        availableSquares[index] = 'X';
        setSquares(availableSquares);
        updateStatus(availableSquares, false);
    }

    function computerPlay(availableSquares) {
        if (calculateWinner(availableSquares, setWinnerMove)) return;
        setTimeout(() => {
            const emptySquares = availableSquares.map((square, index) => square === null ? index : null).filter((square) => square !== null);
            const randomIndex = Math.floor(Math.random() * emptySquares.length);
            availableSquares[emptySquares[randomIndex]] = 'O';
            setSquares(availableSquares);
            updateStatus(availableSquares, true);
            setCanPlay(true);
        }, 1000);
    }

    function resetBoard() {
        setSquares(Array(9).fill(null));
        setXIsNext(xIsNext);
        setStatus('Next player: ' + (xIsNext ? 'X' : 'O'));
        setWinnerMove(Array(3).fill(null));
        setCanPlay(xIsNext ? true : false);
        if(!xIsNext) computerPlay(Array(9).fill(null));
    }

    function updateStatus(squares, xIsNext) {
        const winner = calculateWinner(squares, setWinnerMove);
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
        setXIsNext((xIsNext) => !xIsNext);
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