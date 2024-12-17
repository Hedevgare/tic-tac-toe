import { useState } from "react";
import Square from "./Square";
import { calculateWinner, checkDraw } from "../utils/game";
import { useLocation, useNavigation } from "react-router-dom";

export default function Board() {
    const location = useLocation();
    const { isPvp, hardMode } = location.state;

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

        isPvp ? setCanPlay(true) : computerPlay(newSquares);
    }

    function playerPlay(availableSquares, index) {
        availableSquares[index] = isPvp ? (xIsNext ? 'X' : 'O') : 'X';
        setSquares(availableSquares);
        updateStatus(availableSquares, false);
    }

    function computerPlay(availableSquares) {
        if (calculateWinner(availableSquares, setWinnerMove)) return;

        if (hardMode) {
            const bestMove = findBestOpponentMove(availableSquares);
            setTimeout(() => {
                availableSquares[bestMove] = 'O';
                setSquares(availableSquares);
                updateStatus(availableSquares, true);
                setCanPlay(true);
            }, 1000);
        } else {
            const emptySquares = availableSquares.map((square, index) => square === null ? index : null).filter((index) => index !== null);
            const randomIndex = Math.floor(Math.random() * emptySquares.length);
            setTimeout(() => {
                availableSquares[emptySquares[randomIndex]] = 'O';
                setSquares(availableSquares);
                updateStatus(availableSquares, true);
                setCanPlay(true);
            }, 1000);
        }
    }

    // Separate the minimax algorithm from the computerPlay function; makes it easier to read and test
    function findBestOpponentMove(squares) {
        let bestScore = -Infinity;
        let bestMove = null;

        for (let i = 0; i < squares.length; i++) {
            if (squares[i] === null) {
                squares[i] = 'O';
                let score = minimax(squares, 0, false);
                squares[i] = null;

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    // Recursive minimax algorithm; returns the best score for the current player based on the current board state, a boolean to determine if the current player is maximizing or minimizing, and the depth of the recursion.
    // The depth parameter ensures that winning sooner is preferred over winning later, and losing later is preferred over losing sooner.
    function minimax(squares, depth, isMaximizing) {
        const winner = calculateWinner(squares, () => { });
        // Calculate score
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
        if (checkDraw(squares)) return 0;

        // Maximize for 'O' and minimize for 'X'
        if (isMaximizing) {
            let maxScore = -Infinity;
            for (let i = 0; i < squares.length; i++) {
                if (squares[i] === null) {
                    squares[i] = 'O';
                    let score = minimax(squares, depth + 1, false);
                    squares[i] = null;
                    maxScore = Math.max(score, maxScore);
                }
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for (let i = 0; i < squares.length; i++) {
                if (squares[i] === null) {
                    squares[i] = 'X';
                    let score = minimax(squares, depth + 1, true);
                    squares[i] = null;
                    minScore = Math.min(score, minScore);
                }
            }
            return minScore;
        }
    }

    function resetBoard() {
        setSquares(Array(9).fill(null));
        setXIsNext(xIsNext);
        setStatus('Next player: ' + (xIsNext ? 'X' : 'O'));
        setWinnerMove(Array(3).fill(null));
        if (!isPvp && !xIsNext) {
            setCanPlay(xIsNext ? true : false);
            computerPlay(Array(9).fill(null));
        }
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
                <div className="score-wrapper">
                    <p className="player-name left">Player&nbsp;{isPvp && '1'}</p>
                    <p className="status-score">
                        <span>X</span>{`: ${xScore} - ${oScore} :`}<span>O</span>
                    </p>
                    {isPvp ?
                        <p className="player-name right">Player 2</p> :
                        <p className="player-name right">Computer {hardMode ? '<Hard Mode>' : '<Easy Mode>'}</p>}
                </div>
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