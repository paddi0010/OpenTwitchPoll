const socket = io("http://localhost:4000"); // Overlay-Server


const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");

socket.on("connect", () => {
  console.log("Overlay connected");
});

socket.on("updatePolls", (polls) => {
  const poll = polls[0];

  console.log("Poll update received:", poll); // Debug

  if (!poll) {
    questionEl.textContent = "Keine Umfrage aktiv";
    optionsEl.innerHTML = "";
    timerEl.textContent = "";
    return;
  }

  // Votes zählen
  const counts = new Array(poll.options.length).fill(0);
  Object.values(poll.votes || {}).forEach(vote => counts[vote]++);

  // Frage
  questionEl.textContent = poll.question + (poll.closed ? " [CLOSED]" : "");

  // Optionen rendern
  optionsEl.innerHTML = "";
  poll.options.forEach((option, i) => {
    const li = document.createElement("li");
    li.textContent = `${option} - ${counts[i]} Stimmen`;
    optionsEl.appendChild(li);
  });

  // Timer anzeigen
  if (poll.closed) {
    timerEl.textContent = "Poll closed";
  } else if (poll.remaining !== null && poll.remaining !== undefined) {
    timerEl.textContent = `Time left: ${poll.remaining}s`;
  } else {
    timerEl.textContent = "";
  }
});
