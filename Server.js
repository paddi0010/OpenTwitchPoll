const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Serve static files
app.use(express.static(path.join(__dirname, "./Overlay/index.html")));

// Make overlay directly accessible
app.get("/overlay.html", (req, res) => {
  res.sendFile(path.join(__dirname, "./Overlay/index.html"));
});

// Polls
let polls = [];

io.on("connection", (socket) => {
  console.log("Overlay connected");
  socket.emit("updatePolls", polls);
});

// Poll functions
function addPoll(user, question) {
  const id = Date.now();
  polls.push({ id, user, question, closed: false });
  io.emit("updatePolls", polls);
}

function closePoll(index) {
  if (polls[index] && !polls[index].closed) {
    polls[index].closed = true;
    io.emit("updatePolls", polls);

    const pollId = polls[index].id;
    // Automatically remove poll after 60 seconds (optional)
    setTimeout(() => {
      polls = polls.filter(p => p.id !== pollId);
      io.emit("updatePolls", polls);
    }, 60000);
    return true;
  }
  return false;
}

function clearPolls() {
  polls = [];
  io.emit("updatePolls", polls);
}

server.listen(3000, () => console.log("Server running at http://localhost:3000"));

// Export
module.exports = { addPoll, closePoll, clearPolls, polls, io };
