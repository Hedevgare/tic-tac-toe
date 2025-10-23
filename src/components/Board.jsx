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
    const [xScore, setXScore] = useState(0);
    const [oScore, setOScore] = useState(0);
    const [tieScore, setTieScore] = useState(0);

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
        updateStatus(availableSquares);
    }

    function computerPlay(availableSquares) {
        if (calculateWinner(availableSquares, setWinnerMove)) return;

        if (hardMode) {
            const bestMove = findBestOpponentMove(availableSquares);
            setTimeout(() => {
                availableSquares[bestMove] = 'O';
                setSquares(availableSquares);
                updateStatus(availableSquares);
                setCanPlay(true);
            }, 1000);
        } else {
            const emptySquares = availableSquares.map((square, index) => square === null ? index : null).filter((index) => index !== null);
            const randomIndex = Math.floor(Math.random() * emptySquares.length);
            setTimeout(() => {
                availableSquares[emptySquares[randomIndex]] = 'O';
                setSquares(availableSquares);
                updateStatus(availableSquares);
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
        setWinnerMove(Array(3).fill(null));
        if (!isPvp && !xIsNext) {
            setCanPlay(xIsNext ? true : false);
            computerPlay(Array(9).fill(null));
        }
    }

    function updateStatus(squares) {
        const winner = calculateWinner(squares, setWinnerMove);

        if (winner) {
            winner === 'X' ? setXScore(xScore + 1) : setOScore(oScore + 1);
        } else if (checkDraw(squares)) {
            setTieScore(tieScore + 1);
        }
        
        setXIsNext((xIsNext) => !xIsNext);
    }

    return (
        <>
            <div className="status">
                <div className="score-wrapper">
                    <p><span className={`player-name ${xIsNext ? 'player-active' : ''}`}>Player{isPvp && ' 1'}</span><br />{xScore}</p>
                    <p><span className="player-name">Tie</span><br />{tieScore}</p>
                    {isPvp ?
                        <p><span className={`player-name ${!xIsNext ? 'player-active' : ''}`}>Player 2</span><br />{oScore}</p> :
                        <p><span className={`player-name ${!xIsNext ? 'player-active' : ''}`}>Computer</span><br />{oScore}</p>
                    }
                </div>
            </div>
            <div className="board">
                <div className="board-row">
                    <Square borderClasses={"no-border-left no-border-top"} isWinner={winnerMove.includes(0)} value={squares[0]} onSquareClick={() => handleClick(0)} />
                    <Square borderClasses={"no-border-top"} isWinner={winnerMove.includes(1)} value={squares[1]} onSquareClick={() => handleClick(1)} />
                    <Square borderClasses={"no-border-top no-border-right"} isWinner={winnerMove.includes(2)} value={squares[2]} onSquareClick={() => handleClick(2)} />
                </div>
                <div className="board-row">
                    <Square borderClasses={"no-border-left"} isWinner={winnerMove.includes(3)} value={squares[3]} onSquareClick={() => handleClick(3)} />
                    <Square isWinner={winnerMove.includes(4)} value={squares[4]} onSquareClick={() => handleClick(4)} />
                    <Square borderClasses={"no-border-right"} isWinner={winnerMove.includes(5)} value={squares[5]} onSquareClick={() => handleClick(5)} />
                </div>
                <div className="board-row">
                    <Square borderClasses={"no-border-bottom no-border-left"} isWinner={winnerMove.includes(6)} value={squares[6]} onSquareClick={() => handleClick(6)} />
                    <Square borderClasses={"no-border-bottom"} isWinner={winnerMove.includes(7)} value={squares[7]} onSquareClick={() => handleClick(7)} />
                    <Square borderClasses={"no-border-bottom no-border-right"} isWinner={winnerMove.includes(8)} value={squares[8]} onSquareClick={() => handleClick(8)} />
                </div>
                {<div onClick={resetBoard}>
                    <p className="board-reset-btn">Restart</p>
                </div>}
            </div>
        </>
    );
}