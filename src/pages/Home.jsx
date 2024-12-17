import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [showDifficulties, setShowDifficulties] = useState(false);
    return (
        <div className="menu">
            {!showDifficulties ?
                <>
                    <Link to="#" onClick={() => setShowDifficulties(true)}>
                        <div className="menu-item">
                            Play vs Computer
                        </div>
                    </Link>
                    <Link to="/game" state={{ isPvp: true }}>
                        <div className="menu-item">
                            Play vs Player
                        </div>
                    </Link>
                </> : <>

                    <Link to="/game" state={{ isPvp: false, hardMode: false }}>
                        <div className="menu-item">
                            Easy
                        </div>
                    </Link>
                    <Link to="/game" state={{ isPvp: false, hardMode: true }}>
                        <div className="menu-item">
                            Hard
                        </div>
                    </Link>
                </>
            }
        </div >
    );
}