const GAME = {
    squares: 25,
    squareSize: 16,
    snake: {
        head: {
            position: {
                x: 0,
                y: 0,
            },
            direction: "",
            nextDirection: "",
        },
        segments: []
    },
    food: {
        x: 0,
        y: 0,
        consumed: true
    },
    obstacles: [],
    score: 0,
    playerName: "",
    started: false,
    gameOver: false
}

const initialSegments = 3;

const canvas = document.createElement("canvas");

const DIRECTIONS = {
    UP: "U",
    DOWN: "D",
    LEFT: "L",
    RIGHT: "R"
}

GAME.snake.head.direction = DIRECTIONS.LEFT

function setScore(score) {
    GAME.score = score;
    document.getElementById("score").textContent = GAME.score;
}

function isDead() {
    const { head, segments } = GAME.snake;

    if (segments.find(segment => segment.x === head.position.x && segment.y === head.position.y) !== undefined) return true;

    if (GAME.obstacles.find(obstacle => obstacle.x === head.position.x && obstacle.y === head.position.y) !== undefined) return true;

    return false;

}

function availablePositions() {
    const availablePositions = [];

    for (let i = 0; i < GAME.squares; i++) {
        jLoop: for (let j = 0; j < GAME.squares; j++) {
            const { segments, head } = GAME.snake;

            const x = i;
            const y = j;

            if (x === head.position.x && y === head.position.y) continue;

            if (segments.find(segment => segment.x === x && segment.y === y) !== undefined) continue jLoop;

            if (GAME.obstacles.find(obstacle => obstacle.x === x && obstacle.y === y) !== undefined) continue jLoop;
            

            availablePositions.push({x, y})
        }
    }

    return availablePositions;
}

function spawnFood(availablePositions) {
    GAME.food = availablePositions[Math.floor(Math.random() * availablePositions.length)];

    GAME.food.consumed = false;
}

function drawSnake(ctx) {
    const { head, segments } = GAME.snake;

    // Draw snake

    ctx.fillStyle = "hsl(115, 100%, 50%)"

    ctx.beginPath();
    ctx.rect(head.position.x * GAME.squareSize, head.position.y * GAME.squareSize, GAME.squareSize, GAME.squareSize);
    ctx.fill();

    ctx.translate(head.position.x * GAME.squareSize + (GAME.squareSize / 2), head.position.y * GAME.squareSize + (GAME.squareSize / 2))
    switch (head.direction) {
        case DIRECTIONS.UP: break;
        case DIRECTIONS.DOWN: ctx.rotate(Math.PI); break;
        case DIRECTIONS.LEFT: ctx.rotate(Math.PI * 1.5); break;
        case DIRECTIONS.RIGHT: ctx.rotate(Math.PI * 0.5); break;
    }
    ctx.translate(-(head.position.x * GAME.squareSize + (GAME.squareSize / 2)), -(head.position.y * GAME.squareSize + (GAME.squareSize / 2)))
    

    // eyes
    ctx.beginPath()
    ctx.fillStyle = "#000"
    ctx.arc(head.position.x * GAME.squareSize + (GAME.squareSize / 100 * 25), head.position.y * GAME.squareSize + (GAME.squareSize / 100 * 25), GAME.squareSize / 100 * 15, 0, Math.PI * 2, false)
    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle = "#000"
    ctx.arc(head.position.x * GAME.squareSize + (GAME.squareSize / 100 * 75), head.position.y * GAME.squareSize + (GAME.squareSize / 100 * 25), GAME.squareSize / 100 * 15, 0, Math.PI * 2, false)
    ctx.fill()

    ctx.closePath();

    ctx.translate(head.position.x * GAME.squareSize + (GAME.squareSize / 2), head.position.y * GAME.squareSize + (GAME.squareSize / 2))
    switch (head.direction) {
        case DIRECTIONS.UP: break;
        case DIRECTIONS.DOWN: ctx.rotate(-Math.PI); break;
        case DIRECTIONS.LEFT: ctx.rotate(-Math.PI * 1.5); break;
        case DIRECTIONS.RIGHT: ctx.rotate(-Math.PI * 0.5); break;
    }
    ctx.translate(-(head.position.x * GAME.squareSize + (GAME.squareSize / 2)), -(head.position.y * GAME.squareSize + (GAME.squareSize / 2)))

    // Draw segments
    
    for (let i = 0; i < segments.length; i++) {
        ctx.fillStyle = "hsl(115, 100%, " + (50 - (50 / segments.length) * i) + "%)";
        ctx.beginPath();
        ctx.rect(segments[i].x * GAME.squareSize, segments[i].y * GAME.squareSize, GAME.squareSize, GAME.squareSize);
        ctx.fill();
        ctx.closePath();
    }
}

function drawFood(ctx) {
    ctx.fillStyle = "#f55"
    ctx.beginPath();
    ctx.rect(GAME.food.x * GAME.squareSize, GAME.food.y * GAME.squareSize, GAME.squareSize, GAME.squareSize)
    ctx.fill();
    ctx.closePath();
}

function drawObstacles(ctx) {
    ctx.fillStyle = "#000";
    for (const obstacle of GAME.obstacles) {
        ctx.beginPath();
        ctx.rect(obstacle.x * GAME.squareSize, obstacle.y * GAME.squareSize, GAME.squareSize, GAME.squareSize)
        ctx.fill();
        ctx.closePath();
    }
}

function gameOver() {
    document.getElementById("game-container").removeEventListener("keydown", handleKeys);

    GAME.gameOver = true;
    GAME.started = false;
    
    const gameOverEvent = new Event("gameover");
    canvas.dispatchEvent(gameOverEvent);
}

function nextFrame() {
    if (!GAME.started) GAME.started = true;

    const { head, segments } = GAME.snake;

    head.direction = head.nextDirection;

    const previousPosition = {
        x: head.position.x,
        y: head.position.y
    };

    switch (head.direction) {
        case DIRECTIONS.UP: head.position.y = head.position.y - 1; break;
        case DIRECTIONS.DOWN: head.position.y = head.position.y + 1; break;
        case DIRECTIONS.LEFT: head.position.x = head.position.x - 1; break;
        case DIRECTIONS.RIGHT: head.position.x = head.position.x + 1; break;
    }

    if (head.position.x > GAME.squares - 1) {
        head.position.x = 0;
    }

    if (head.position.x < 0) {
        head.position.x = GAME.squares - 1;
    }

    if (head.position.y > GAME.squares - 1) {
        head.position.y = 0;
    }

    if (head.position.y < 0) {
        head.position.y = GAME.squares - 1;
    }

    let newSegment;

    if (head.position.x === GAME.food.x && head.position.y === GAME.food.y) {
        GAME.food.consumed = true;


        if (segments.length > 0) {
            newSegment = {
                x: segments[segments.length - 1].x,
                y: segments[segments.length - 1].y
            }
        } else {
            newSegment = previousPosition;
        }
    }

    if (segments.length > 0) {
        for (let i = segments.length - 1; i > 0; i--) {
            segments[i] = segments[i - 1];
        }

        segments[0] = previousPosition;
    }

    if (newSegment) segments.push(newSegment);

    if (isDead()) {
        gameOver();
        return;
    };

    if (GAME.food.consumed) {
        const positions = availablePositions();
        setScore(GAME.score + 1);
        
        const foodEvent = new Event("foodconsumed");
        canvas.dispatchEvent(foodEvent);

        if (positions.length > 0) {
            spawnFood(positions);
        } else {
            // GANAMOOOOS! GOOOOOOOOOOOOOOOOL!
            return;
        }
    }

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawSnake(ctx);

    drawFood(ctx);

    drawObstacles(ctx);

    setTimeout(() => {
        nextFrame();
    }, Math.max(300 - (GAME.snake.segments.length * 8), 80))
}

function isValidDirection(key) {
    const { head } = GAME.snake;

    switch (key) {
        case "ArrowUp": if (head.direction === DIRECTIONS.DOWN) return false; break;
        case "ArrowDown": if (head.direction === DIRECTIONS.UP) return false; break;
        case "ArrowLeft": if (head.direction === DIRECTIONS.RIGHT) return false; break;
        case "ArrowRight": if (head.direction === DIRECTIONS.LEFT) return false; break;
    }

    return true;
}

function setDirection(key) {
    if (GAME.gameOver) return;
    if (!isValidDirection(key)) return;
    
    const { head } = GAME.snake;
    

    switch (key) {
        case "ArrowUp":
            head.nextDirection = DIRECTIONS.UP;
            break;
        case "ArrowDown":
            head.nextDirection = DIRECTIONS.DOWN;
            break;
        case "ArrowLeft":
            head.nextDirection = DIRECTIONS.LEFT;
            break;
        case "ArrowRight":
            head.nextDirection = DIRECTIONS.RIGHT;
            break;
    }

    if (!GAME.started) {
        const gameStartEvent = new Event("gamestart");
        canvas.dispatchEvent(gameStartEvent);
        nextFrame();
    }
}

function handleKeys(e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        setDirection(e.key);
    }
}

function startGame() {

    // Init snake

    GAME.snake.head.position.x = Math.floor(GAME.squares / 4);
    GAME.snake.head.position.y = Math.floor(GAME.squares / 4);
    GAME.snake.head.direction = DIRECTIONS.LEFT
    GAME.snake.segments = [];

    for (let i = 0; i < initialSegments; i++) {
        const segment = {
            x: GAME.snake.head.position.x + (i + 1),
            y: GAME.snake.head.position.y
        };
        GAME.snake.segments.push(segment);
    }

    // Init obstacles
    
    for (let i = 0; i < GAME.squares; i++) {
        const obstacle = {
            x: i,
            y: Math.floor(GAME.squares / 2),
        }

        GAME.obstacles.push(obstacle)
    }

    /*
    for (let i = 0; i < GAME.squares; i++) {
        const obstacle = {
            x: Math.floor(GAME.squares / 2),
            y: i
        }

        GAME.obstacles.push(obstacle)
    }
    */
    

    
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    spawnFood(availablePositions());
    drawFood(ctx);

    drawSnake(ctx);
    drawObstacles(ctx)

    setScore(0);
    GAME.gameOver = false;
    document.getElementById("game-container").addEventListener("keydown", handleKeys);
}

// OMG

let playerName;

function printMessage(message, color = null) {
    const chat = document.getElementById("chat");
    
    const li = document.createElement("li");

    const now = new Date();

    const hours = now.getHours(), minutes = now.getMinutes();

    li.textContent = "[" + hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + "] " + message;
    li.style.color = color ? color : "#eee";

    chat.append(li);

    chat.scroll({
        top: chat.clientHeight
    })
}

function updatePlayerList(players) {
    const playerList = document.getElementById("players");

    playerList.innerHTML = "";

    players.sort((a, b) => {a.score > b.score});

    for (const player of players) {
        const li = document.createElement("li");
        const name = document.createElement("span")
        const score = document.createElement("span")

        name.textContent = player.name;
        score.textContent = player.currentScore;

        li.append(name, score)

        playerList.append(li)
    }
}

class SocketEvents {
    players = []

    constructor (socket) {
        this.socket = socket
    }

    arrived(e) {
        const {playerName, players} = JSON.parse(e);
        printMessage("El jugador " + playerName + " se ha conectado.");
        this.players = players;
        updatePlayerList(this.players)
    }
    foodconsumed(e) {
        const {players} = JSON.parse(e);
        this.players = players;
        updatePlayerList(this.players);
    }
    gameover(e) {
        const { playerName, score, players } = JSON.parse(e);
        printMessage("El jugador " + playerName + " ha terminado una partida con " + score + " puntos!", "#0a0");
        this.players = players
        updatePlayerList(this.players);
    }
    gamestart(e) {
        printMessage("El jugador " + e + " ha comenzado una partida!");
    }
    message(e) {
        const { playerName, message } = JSON.parse(e);
        printMessage(playerName + ": " + message);
    }
    playerleft(e) {
        const {playerName} = JSON.parse(e);
        printMessage(playerName + " se ha ido.", "#f33");
        this.players = this.players.filter(player => player.name !== playerName);
        updatePlayerList(this.players);
    }
}

window.addEventListener("load", () => {
    canvas.width = GAME.squares * GAME.squareSize;
    canvas.height = GAME.squares * GAME.squareSize;

    document.getElementById("game").append(canvas)

    const dialog = document.querySelector("dialog");
    dialog.showModal();

    const formPlayer = dialog.querySelector("form");

    dialog.addEventListener("close", () => {

        playerName = formPlayer.elements["playerName"].value !== "" ? formPlayer.elements["playerName"].value : "Anonimo" + Math.floor(Math.random() * 3000);
        formPlayer.reset();

        document.getElementById("game-container").focus();

        const socket = io();

        const socketEvents = new SocketEvents(socket);

        socket.on("connect", () => {

            socket.volatile.emit("arrived", playerName);

            socket.on("arrived", socketEvents.arrived)
            
            printMessage("Te has conectado a la sala. Escribe un mensaje!")

            canvas.addEventListener("gameover", () => {
                socket.volatile.emit("gameover", JSON.stringify({score: GAME.score}));
            })

            canvas.addEventListener("gamestart", () => {
                socket.volatile.emit("gamestart", "");
            })

            canvas.addEventListener("foodconsumed", () => {
                socket.volatile.emit("foodconsumed", "");
            })

            socket.on("gamestart", socketEvents.gamestart)

            socket.on("gameover", socketEvents.gameover)

            socket.on("foodconsumed", socketEvents.foodconsumed)

            socket.on("message", socketEvents.message)

            socket.on("playerleft", socketEvents.playerleft)

            function sendMessage(e) {
                e.preventDefault();
                            
                if (e.target.elements["message"].value.length < 1) return;
            
                socket.volatile.emit("message", e.target.elements["message"].value);
            
                e.target.reset();
            }

            const formMessage = document.forms["form-message"];

            for (const element of formMessage.elements) {
                element.removeAttribute("disabled")
            }

            formMessage.addEventListener("submit", sendMessage);

            socket.on("disconnect", () => {
                for (const element of formMessage.elements) {
                    element.setAttribute("disabled", "")
                }

                formMessage.removeEventListener("submit", sendMessage);

                printMessage("Se ha perdido la conexion con la sala", "#f33")
                socket.off("arrived", socketEvents.arrived)
                socket.off("playerleft", socketEvents.playerleft);
                socket.off("score", socketEvents.score);
                socket.off("gamestart", socketEvents.gamestart);
                socket.off("message", socketEvents.message);
                socket.removeAllListeners("disconnect");
            })

        })
    })

    
    startGame()

    canvas.addEventListener("gameover", () => {
        setTimeout(() => {
            startGame();
        }, 1000)
    })
})