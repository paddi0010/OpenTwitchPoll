const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Serve static files
app.use(express.static(path.join(__dirname, "Overlay")));

// Provide HTTP route for fetching the current poll
app.get("/poll", (req, res) => {
    if (!polls.length) return res.json({});
    res.json(polls[0]); // only the first poll
});

// Polls array
let polls = [];

io.on("connection", (socket) => {
  console.log("Overlay connected");
  socket.emit("updatePolls", polls);

  // Optional: Receive polls from the bot
  socket.on("updatePolls", (newPolls) => {
    polls = newPolls;
    io.emit("updatePolls", polls);
  });
});

// Start the server
server.listen(3000, () => console.log("Server running at http://localhost:3000"));

// Export for bot if needed
module.exports = { io };
