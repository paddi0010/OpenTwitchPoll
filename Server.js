const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Statische Dateien
app.use(express.static(path.join(__dirname, "./Overlay/index.html")));


// Overlay direkt erreichbar machen
app.get("/overlay.html", (req, res) => {
  res.sendFile(path.join(__dirname, "./Overlay/index.html"));
});



// Tasks
let tasks = [];

io.on("connection", (socket) => {
  console.log("Overlay verbunden");
  socket.emit("updateTasks", tasks);
});

// Task-Funktionen
function addTask(user, task) {
  const id = Date.now();
  tasks.push({ id, user, task, done: false });
  io.emit("updateTasks", tasks);
}

function markTaskDone(index) {
  if (tasks[index] && !tasks[index].done) {
    tasks[index].done = true;
    io.emit("updateTasks", tasks);
    const taskId = tasks[index].id;
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== taskId);
      io.emit("updateTasks", tasks);
    }, 60000);
    return true;
  }
  return false;
}

function clearTasks() {
  tasks = [];
  io.emit("updateTasks", tasks);
}

// Server starten
server.listen(3000, () => console.log("Server läuft auf http://localhost:3000"));

// Export (falls nötig)
module.exports = { addTask, markTaskDone, clearTasks, tasks, io };
