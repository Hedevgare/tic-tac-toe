import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client"
import { Routes, Route, HashRouter, Link } from "react-router-dom";

import "./styles.css";

import Home from "./pages/Home";
import Game from "./pages/Game";

const VERSION = "v0.2.0";

const root = createRoot(document.getElementById("root"));
root.render(
    <StrictMode>
        <HashRouter>
            <header>
                <p><Link to="/">TicTacToe</Link></p>
            </header>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game" element={<Game />} />
            </Routes>
        </HashRouter>
        <footer>
            <p>Hedegare 2024 - {VERSION}</p>
        </footer>
    </StrictMode>
);