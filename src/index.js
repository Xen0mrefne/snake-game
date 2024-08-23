const { Server } = require("socket.io");
const {createServer} = require("http")
const express = require("express");
const { join } = require("path");
const GameService = require("./services/gameService");

const app = express();

app.use(express.static("public"))

const httpServer = createServer(app);


app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "../public/index.html"))
})

const game = new GameService();

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    game.addPlayer(socket.id);

    socket.on("arrived", e => {
        const playerName = game.setPlayerName(socket.id, e);
        io.emit("arrived", JSON.stringify({playerName, players: game.getPlayerList()}))
    })

    socket.on("gameover", e => {
        const score = game.getCurrentScore(socket.id)
        game.handlePlayerScore(socket.id);
        game.setCurrentScore(socket.id, 0);
        io.emit("gameover", JSON.stringify({ playerName: game.getPlayerName(socket.id), score , players: game.getPlayerList()}));
    })

    socket.on("foodconsumed", e => {
        game.setCurrentScore(socket.id, game.getCurrentScore(socket.id) + 1);
        game.handlePlayerScore(socket.id);
        io.emit("foodconsumed", JSON.stringify({players: game.getPlayerList()}))
    })

    socket.on("message", e => {
        io.emit("message", JSON.stringify({message: e, playerName: game.getPlayerName(socket.id)}));
    })

    socket.on("gamestart", () => {
        io.emit("gamestart", game.getPlayerName(socket.id));
    })

    socket.on("disconnect", e => {
        const playerName = game.getPlayerName(socket.id)
        game.removePlayer(socket.id)

        io.emit("playerleft", JSON.stringify({
            playerName,
            players: game.getPlayerList()
        }));

        socket.disconnect(true);
    })
    
})

httpServer.listen(3000, () => {
    console.log("Listening on port 3000");
});