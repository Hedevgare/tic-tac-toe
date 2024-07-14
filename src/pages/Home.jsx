import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="menu">
            <div className="menu-item">
                <Link to="/game" state={{ isPvp: false }}>Play vs Computer</Link>
            </div>
            <div className="menu-item">
                <Link to="/game" state={{ isPvp: true }}>Play vs Player</Link>
            </div>
        </div>
    );
}