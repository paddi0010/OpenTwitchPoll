const socket = io("http://localhost:4000"); // Overlay-Server

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");

socket.on("connect", () => {
  console.log("Overlay connected");
});

socket.on("updatePolls", (polls) => {
  const poll = polls[0];

  if (!poll) {
    questionEl.textContent = "";
    optionsEl.innerHTML = "";
    timerEl.textContent = "";
    return;
  }

  // Votes
  const counts = new Array(poll.options.length).fill(0);
  Object.values(poll.votes || {}).forEach(vote => counts[vote]++);

  questionEl.textContent = poll.question + (poll.closed ? " [CLOSED]" : "");

  optionsEl.innerHTML = "";
  poll.options.forEach((option, i) => {
    const li = document.createElement("li");
    li.textContent = `${option} - ${counts[i]} Stimmen`;
    optionsEl.appendChild(li);
  });

  // Timer aktualisieren
  timerEl.textContent = poll.closed 
    ? "Poll closed" 
    : `Time left: ${poll.remaining ?? 0}s`;
});
