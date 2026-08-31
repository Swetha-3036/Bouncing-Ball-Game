// ======================================================
// HTML ELEMENTS
// ======================================================

const menuScreen =
    document.getElementById("menuScreen");

const gameScreen =
    document.getElementById("gameScreen");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const pauseScreen =
    document.getElementById("pauseScreen");


const playButton =
    document.getElementById("playButton");

const playAgainButton =
    document.getElementById("playAgainButton");

const mainMenuButton =
    document.getElementById("mainMenuButton");

const pauseButton =
    document.getElementById("pauseButton");

const resumeButton =
    document.getElementById("resumeButton");

const restartPauseButton =
    document.getElementById("restartPauseButton");

const menuPauseButton =
    document.getElementById("menuPauseButton");


const leftButton =
    document.getElementById("leftButton");

const rightButton =
    document.getElementById("rightButton");


const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


const scoreText =
    document.getElementById("score");

const levelText =
    document.getElementById("level");

const livesText =
    document.getElementById("lives");

const coinsText =
    document.getElementById("coins");


const menuHighScore =
    document.getElementById("menuHighScore");


const finalScore =
    document.getElementById("finalScore");

const finalHighScore =
    document.getElementById("finalHighScore");

const finalCoins =
    document.getElementById("finalCoins");


// ======================================================
// GAME VARIABLES
// ======================================================

let score = 0;

let level = 1;

let lives = 3;

let coins = 0;

let gameRunning = false;

let gamePaused = false;

let animationId;


// ======================================================
// HIGH SCORE
// ======================================================

let highScore =
    Number(
        localStorage.getItem(
            "bouncingBallHighScore"
        )
    ) || 0;


menuHighScore.textContent =
    highScore;


// ======================================================
// KEYBOARD
// ======================================================

let leftPressed = false;

let rightPressed = false;


document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            leftPressed = true;

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            rightPressed = true;

        }


        if (
            event.key.toLowerCase() === "p"
        ) {

            togglePause();

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            leftPressed = false;

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            rightPressed = false;

        }

    }
);


// ======================================================
// BALL
// ======================================================

const ball = {

    x: 100,

    y: 100,

    radius: 15,

    velocityX: 0,

    velocityY: 0,

    gravity: 0.5,

    bounce: -12,

    speed: 5,

    shield: false,

    speedBoost: false

};


// ======================================================
// PLATFORMS
// ======================================================

const platforms = [

    {
        x: 30,
        y: 450,
        width: 200,
        height: 20
    },

    {
        x: 300,
        y: 350,
        width: 200,
        height: 20
    },

    {
        x: 550,
        y: 250,
        width: 200,
        height: 20
    },

    {
        x: 300,
        y: 150,
        width: 180,
        height: 20
    },

    {
        x: 50,
        y: 80,
        width: 150,
        height: 20
    }

];


// ======================================================
// OBSTACLES
// ======================================================

let obstacles = [];


function createObstacles() {

    obstacles = [

        {
            x: 250,
            y: 420,
            width: 30,
            height: 30
        },

        {
            x: 510,
            y: 320,
            width: 30,
            height: 30
        },

        {
            x: 700,
            y: 220,
            width: 30,
            height: 30
        }

    ];


    // Add more obstacles in higher levels

    if (level >= 2) {

        obstacles.push({

            x: 220,

            y: 180,

            width: 30,

            height: 30

        });

    }


    if (level >= 3) {

        obstacles.push({

            x: 600,

            y: 100,

            width: 30,

            height: 30

        });

    }

}


// ======================================================
// COINS
// ======================================================

let coinObjects = [];


function createCoins() {

    coinObjects = [

        {
            x: 180,
            y: 400,
            radius: 10,
            collected: false
        },

        {
            x: 430,
            y: 300,
            radius: 10,
            collected: false
        },

        {
            x: 650,
            y: 200,
            radius: 10,
            collected: false
        },

        {
            x: 400,
            y: 100,
            radius: 10,
            collected: false
        }

    ];

}


// ======================================================
// POWER UPS
// ======================================================

let powerUps = [];


function createPowerUps() {

    powerUps = [

        {
            x: 250,
            y: 320,
            type: "shield",
            active: true
        },

        {
            x: 600,
            y: 170,
            type: "speed",
            active: true
        }

    ];

}


// ======================================================
// START GAME
// ======================================================

function startGame() {

    cancelAnimationFrame(
        animationId
    );


    score = 0;

    level = 1;

    lives = 3;

    coins = 0;


    ball.x = 100;

    ball.y = 100;

    ball.velocityX = 0;

    ball.velocityY = 0;

    ball.speed = 5;

    ball.shield = false;

    ball.speedBoost = false;


    gameRunning = true;

    gamePaused = false;


    scoreText.textContent =
        score;

    levelText.textContent =
        level;

    livesText.textContent =
        "❤️❤️❤️";

    coinsText.textContent =
        coins;


    createObstacles();

    createCoins();

    createPowerUps();


    menuScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    pauseScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );


    gameLoop();

}


// ======================================================
// UPDATE LEVEL
// ======================================================

function updateLevel() {

    const newLevel =
        Math.floor(
            score / 100
        ) + 1;


    if (
        newLevel !== level
    ) {

        level = newLevel;

        createObstacles();

        ball.speed =
            5 +
            (level - 1) * 0.7;

    }


    levelText.textContent =
        level;

}


// ======================================================
// UPDATE GAME
// ======================================================

function update() {

    if (
        !gameRunning ||
        gamePaused
    ) {

        return;

    }


    // ----------------------------------------
    // PLAYER MOVEMENT
    // ----------------------------------------

    const currentSpeed =
        ball.speedBoost
            ? ball.speed * 1.8
            : ball.speed;


    if (leftPressed) {

        ball.velocityX =
            -currentSpeed;

    }

    else if (rightPressed) {

        ball.velocityX =
            currentSpeed;

    }

    else {

        ball.velocityX *= 0.85;

    }


    // ----------------------------------------
    // GRAVITY
    // ----------------------------------------

    ball.velocityY +=
        ball.gravity;


    // ----------------------------------------
    // MOVE
    // ----------------------------------------

    ball.x +=
        ball.velocityX;

    ball.y +=
        ball.velocityY;


    // ----------------------------------------
    // WALL COLLISION
    // ----------------------------------------

    if (
        ball.x -
        ball.radius < 0
    ) {

        ball.x =
            ball.radius;

        ball.velocityX =
            Math.abs(
                ball.velocityX
            );

    }


    if (
        ball.x +
        ball.radius >
        canvas.width
    ) {

        ball.x =
            canvas.width -
            ball.radius;

        ball.velocityX =
            -Math.abs(
                ball.velocityX
            );

    }


    // ----------------------------------------
    // PLATFORM COLLISION
    // ----------------------------------------

    platforms.forEach(
        function(platform) {

            const bottom =
                ball.y +
                ball.radius;


            const previousBottom =
                bottom -
                ball.velocityY;


            const horizontal =
                ball.x +
                    ball.radius >
                    platform.x &&

                ball.x -
                    ball.radius <
                    platform.x +
                    platform.width;


            const vertical =
                previousBottom <=
                    platform.y &&

                bottom >=
                    platform.y;


            if (
                horizontal &&
                vertical &&
                ball.velocityY > 0
            ) {

                ball.y =
                    platform.y -
                    ball.radius;


                ball.velocityY =
                    ball.bounce;


                score += 10;


                scoreText.textContent =
                    score;


                updateLevel();

            }

        }
    );


    // ----------------------------------------
    // COIN COLLISION
    // ----------------------------------------

    coinObjects.forEach(
        function(coin) {

            if (
                coin.collected
            ) {

                return;

            }


            const distance =
                Math.sqrt(

                    Math.pow(
                        ball.x -
                        coin.x,
                        2
                    ) +

                    Math.pow(
                        ball.y -
                        coin.y,
                        2
                    )

                );


            if (
                distance <
                ball.radius +
                coin.radius
            ) {

                coin.collected =
                    true;


                coins++;

                score += 50;


                coinsText.textContent =
                    coins;

                scoreText.textContent =
                    score;


                updateLevel();

            }

        }
    );


    // ----------------------------------------
    // POWER-UP COLLISION
    // ----------------------------------------

    powerUps.forEach(
        function(power) {

            if (
                !power.active
            ) {

                return;

            }


            const distance =
                Math.sqrt(

                    Math.pow(
                        ball.x -
                        power.x,
                        2
                    ) +

                    Math.pow(
                        ball.y -
                        power.y,
                        2
                    )

                );


            if (
                distance < 30
            ) {

                power.active =
                    false;


                if (
                    power.type ===
                    "shield"
                ) {

                    ball.shield =
                        true;

                }


                if (
                    power.type ===
                    "speed"
                ) {

                    ball.speedBoost =
                        true;


                    setTimeout(
                        function() {

                            ball.speedBoost =
                                false;

                        },
                        5000
                    );

                }

            }

        }
    );


    // ----------------------------------------
    // OBSTACLE COLLISION
    // ----------------------------------------

    for (
        let obstacle of obstacles
    ) {

        const collision =

            ball.x +
                ball.radius >
                obstacle.x &&

            ball.x -
                ball.radius <
                obstacle.x +
                obstacle.width &&

            ball.y +
                ball.radius >
                obstacle.y &&

            ball.y -
                ball.radius <
                obstacle.y +
                obstacle.height;


        if (collision) {

            handleObstacleCollision(
                obstacle
            );

            break;

        }

    }


    // ----------------------------------------
    // FALLING
    // ----------------------------------------

    if (
        ball.y -
        ball.radius >
        canvas.height
    ) {

        loseLife();

    }

}


// ======================================================
// OBSTACLE COLLISION
// ======================================================

function handleObstacleCollision(
    obstacle
) {

    if (
        ball.shield
    ) {

        ball.shield =
            false;

        ball.velocityY =
            ball.bounce;

        return;

    }


    loseLife();

}


// ======================================================
// LOSE LIFE
// ======================================================

function loseLife() {

    lives--;


    updateLives();


    if (
        lives <= 0
    ) {

        endGame();

        return;

    }


    // Reset ball

    ball.x = 100;

    ball.y = 100;

    ball.velocityX = 0;

    ball.velocityY = 0;

}


// ======================================================
// UPDATE LIVES
// ======================================================

function updateLives() {

    let hearts = "";

    for (
        let i = 0;
        i < lives;
        i++
    ) {

        hearts += "❤️";

    }


    livesText.textContent =
        hearts;

}


// ======================================================
// DRAW BACKGROUND
// ======================================================

function drawBackground() {

    ctx.fillStyle =
        "#cce3a9";


    ctx.fillRect(

        0,
        0,
        canvas.width,
        canvas.height

    );


    // Retro grid

    ctx.strokeStyle =
        "rgba(0,0,0,0.08)";


    for (
        let x = 0;
        x < canvas.width;
        x += 10
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y < canvas.height;
        y += 10
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();

    }

}


// ======================================================
// DRAW PLATFORMS
// ======================================================

function drawPlatforms() {

    platforms.forEach(
        function(platform) {

            ctx.fillStyle =
                "#18220f";


            ctx.fillRect(

                platform.x,

                platform.y,

                platform.width,

                platform.height

            );

        }
    );

}


// ======================================================
// DRAW OBSTACLES
// ======================================================

function drawObstacles() {

    obstacles.forEach(
        function(obstacle) {

            ctx.fillStyle =
                "#111";


            // Spike-style triangle

            ctx.beginPath();

            ctx.moveTo(
                obstacle.x +
                obstacle.width / 2,

                obstacle.y
            );

            ctx.lineTo(

                obstacle.x,

                obstacle.y +
                obstacle.height

            );

            ctx.lineTo(

                obstacle.x +
                obstacle.width,

                obstacle.y +
                obstacle.height

            );

            ctx.closePath();

            ctx.fill();

        }
    );

}


// ======================================================
// DRAW COINS
// ======================================================

function drawCoins() {

    coinObjects.forEach(
        function(coin) {

            if (
                coin.collected
            ) {

                return;

            }


            ctx.beginPath();


            ctx.arc(

                coin.x,

                coin.y,

                coin.radius,

                0,

                Math.PI * 2

            );


            ctx.fillStyle =
                "#555";


            ctx.fill();


            ctx.strokeStyle =
                "#111";

            ctx.stroke();


            ctx.closePath();

        }
    );

}


// ======================================================
// DRAW POWER UPS
// ======================================================

function drawPowerUps() {

    powerUps.forEach(
        function(power) {

            if (
                !power.active
            ) {

                return;

            }


            ctx.font =
                "22px Arial";


            if (
                power.type ===
                "shield"
            ) {

                ctx.fillText(
                    "S",
                    power.x - 8,
                    power.y + 8
                );

            }


            if (
                power.type ===
                "speed"
            ) {

                ctx.fillText(
                    "⚡",
                    power.x - 10,
                    power.y + 8
                );

            }

        }
    );

}


// ======================================================
// DRAW BALL
// ======================================================

function drawBall() {

    ctx.beginPath();


    ctx.arc(

        ball.x,

        ball.y,

        ball.radius,

        0,

        Math.PI * 2

    );


    ctx.fillStyle =
        "#101510";


    ctx.fill();


    ctx.closePath();


    // Shield effect

    if (
        ball.shield
    ) {

        ctx.beginPath();


        ctx.arc(

            ball.x,

            ball.y,

            ball.radius + 8,

            0,

            Math.PI * 2

        );


        ctx.strokeStyle =
            "#333";

        ctx.lineWidth = 3;

        ctx.stroke();


        ctx.closePath();

    }

}


// ======================================================
// DRAW EVERYTHING
// ======================================================

function draw() {

    drawBackground();

    drawPlatforms();

    drawObstacles();

    drawCoins();

    drawPowerUps();

    drawBall();

}


// ======================================================
// GAME LOOP
// ======================================================

function gameLoop() {

    update();

    draw();


    if (
        gameRunning
    ) {

        animationId =
            requestAnimationFrame(
                gameLoop
            );

    }

}


// ======================================================
// GAME OVER
// ======================================================

function endGame() {

    gameRunning = false;


    cancelAnimationFrame(
        animationId
    );


    finalScore.textContent =
        score;


    finalCoins.textContent =
        coins;


    if (
        score > highScore
    ) {

        highScore =
            score;


        localStorage.setItem(

            "bouncingBallHighScore",

            highScore

        );

    }


    finalHighScore.textContent =
        highScore;


    menuHighScore.textContent =
        highScore;


    gameScreen.classList.add(
        "hidden"
    );


    gameOverScreen.classList.remove(
        "hidden"
    );

}


// ======================================================
// PAUSE
// ======================================================

function togglePause() {

    if (
        !gameRunning
    ) {

        return;

    }


    gamePaused =
        !gamePaused;


    if (
        gamePaused
    ) {

        pauseScreen.classList.remove(
            "hidden"
        );

    }

    else {

        pauseScreen.classList.add(
            "hidden"
        );

    }

}


// ======================================================
// MAIN MENU
// ======================================================

function showMainMenu() {

    gameRunning = false;

    gamePaused = false;


    cancelAnimationFrame(
        animationId
    );


    pauseScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    menuScreen.classList.remove(
        "hidden"
    );


    menuHighScore.textContent =
        highScore;

}


// ======================================================
// BUTTON EVENTS
// ======================================================

playButton.addEventListener(
    "click",
    startGame
);


playAgainButton.addEventListener(
    "click",
    startGame
);


mainMenuButton.addEventListener(
    "click",
    showMainMenu
);


pauseButton.addEventListener(
    "click",
    togglePause
);


resumeButton.addEventListener(
    "click",
    togglePause
);


restartPauseButton.addEventListener(
    "click",
    startGame
);


menuPauseButton.addEventListener(
    "click",
    showMainMenu
);


// ======================================================
// MOBILE CONTROLS
// ======================================================

function leftStart(event) {

    event.preventDefault();

    leftPressed = true;

}


function leftStop(event) {

    event.preventDefault();

    leftPressed = false;

}


function rightStart(event) {

    event.preventDefault();

    rightPressed = true;

}


function rightStop(event) {

    event.preventDefault();

    rightPressed = false;

}


// LEFT

leftButton.addEventListener(
    "mousedown",
    leftStart
);

leftButton.addEventListener(
    "mouseup",
    leftStop
);

leftButton.addEventListener(
    "mouseleave",
    leftStop
);

leftButton.addEventListener(
    "touchstart",
    leftStart,
    { passive: false }
);

leftButton.addEventListener(
    "touchend",
    leftStop,
    { passive: false }
);


// RIGHT

rightButton.addEventListener(
    "mousedown",
    rightStart
);

rightButton.addEventListener(
    "mouseup",
    rightStop
);

rightButton.addEventListener(
    "mouseleave",
    rightStop
);

rightButton.addEventListener(
    "touchstart",
    rightStart,
    { passive: false }
);

rightButton.addEventListener(
    "touchend",
    rightStop,
    { passive: false }
);


// ======================================================
// INITIALIZE
// ======================================================

createObstacles();

createCoins();

createPowerUps();

draw();