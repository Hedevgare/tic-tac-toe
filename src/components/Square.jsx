export default function Square({ value, onSquareClick, isWinner, borderClasses }) {
    const winnerClass = isWinner ? 'winner' : '';
    return (
        <button className={`square ${winnerClass} ${borderClasses}`} onClick={onSquareClick}>{value}</button>
    );
}