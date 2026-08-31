import { Game } from "./game.js";

import { setupKeyboard }
    from "./input.js";

import {
    getHighScore,
    saveHighScore
} from "./storage.js";


const menuScreen =
    document.getElementById("menuScreen");

const gameScreen =
    document.getElementById("gameScreen");

const gameOverScreen =
    document.getElementById("gameOverScreen");


const playButton =
    document.getElementById("playButton");

const restartButton =
    document.getElementById("restartButton");

const menuButton =
    document.getElementById("menuButton");


const canvas =
    document.getElementById("gameCanvas");

const score =
    document.getElementById("score");

const level =
    document.getElementById("level");


const finalScore =
    document.getElementById("finalScore");

const finalHighScore =
    document.getElementById("finalHighScore");


const menuHighScore =
    document.getElementById("menuHighScore");


menuHighScore.textContent =
    getHighScore();


const game =
    new Game(
        canvas,
        score,
        level
    );


setupKeyboard(game);


playButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


menuButton.addEventListener(
    "click",
    showMenu
);


function startGame() {

    menuScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    score.textContent = "0";

    level.textContent = "1";

    game.start();
}


function showMenu() {

    game.running = false;

    gameScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    menuScreen.classList.remove("hidden");

    menuHighScore.textContent =
        getHighScore();
}