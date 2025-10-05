export default function Square({ value, onSquareClick, isWinner, borderClasses }) {
    const winnerClass = isWinner ? 'winner' : '';

    const moveClass = value === 'X' ? 'x-move' : value === 'O' ? 'o-move' : ' ';

    return (
        <div className={`square ${winnerClass} ${borderClasses} ${moveClass}`} onClick={onSquareClick} />
    );
}