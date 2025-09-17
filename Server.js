const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, "Overlay")));


let polls = [];

app.get("/poll", (req, res) => {
  if (!polls.length) return res.json({});
  res.json(polls[0]);
});

io.on("connection", (socket) => {
  console.log("Overlay connected");
  socket.emit("updatePolls", polls);
});

function startPoll(poll) {
  polls = [poll];
  io.emit("updatePolls", polls);
}

function stopPoll() {
  polls = [];
  io.emit("updatePolls", polls);
}

function updateVotes(updatedPoll) {
  if (!polls.length) return;
  polls[0].votes = updatedPoll.votes;
  io.emit("updatePolls", polls);
}

function getCurrentPoll() {
  return polls[0] || null;
}


const PORT = 3002;
server.listen(PORT)
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} ist bereits belegt!`);
    } else {
      console.error(err);
    }
  })
  .on('listening', () => console.log(`Overlay server running at http://localhost:${PORT}`));


module.exports = { startPoll, stopPoll, updateVotes, getCurrentPoll };
