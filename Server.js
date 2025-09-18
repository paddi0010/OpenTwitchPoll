const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const PORT = 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let currentPoll = null;

app.use(express.static("Overlay"));

app.get("/poll", (req, res) => res.json(currentPoll || {}));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Overlay", "index.html"));
});

io.on("connection", (socket) => {
  console.log("Overlay connected");
  socket.emit("updatePolls", currentPoll ? [currentPoll] : []);
});

function updatePoll(poll) {
  currentPoll = poll;
  io.emit("updatePolls", currentPoll ? [currentPoll] : []);
}

server.listen(PORT, () => console.log(`Overlay Server läuft auf http://localhost:${PORT}`));

module.exports = { updatePoll };
