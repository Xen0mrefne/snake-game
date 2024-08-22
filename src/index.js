const { Server } = require("socket.io");
const {createServer} = require("http")
const express = require("express");
const { join } = require("path")

const app = express();

app.use(express.static("public"))

const httpServer = createServer(app);


app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "../public/index.html"))
})

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    socket.on("score", e => {
        io.emit("score", e)
    })

    socket.on("message", e => {
        io.emit("message", e);
    })

    socket.on("arrived", e => {
        io.emit("arrived", e)
    })

    socket.on("gamestart", e => {
        io.emit("gamestart", e);
    })
})

httpServer.listen(3000, () => {
    console.log("Listening on port 3000");
});