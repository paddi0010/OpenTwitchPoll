const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Overlay static files
app.use(express.static(path.join(__dirname, "Overlay")));

// Polls storage
let polls = [];

// API endpoint
app.get("/poll", (req, res) => {
  if (!polls.length) return res.json({});
  res.json(polls[0]);
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Overlay connected");
  socket.emit("updatePolls", polls);
});

// Poll functions for bot
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

server.listen(3000, () => console.log("Server running at http://localhost:3000"));

// Export functions for bot
module.exports = { startPoll, stopPoll, updateVotes, getCurrentPoll };
