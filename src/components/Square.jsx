export default function Square({ value, onSquareClick, isWinner }) {
    const winnerClass = isWinner ? 'winner' : '';
    return (
        <button className={`square ${winnerClass}`} onClick={onSquareClick}>{value}</button>
    );
}