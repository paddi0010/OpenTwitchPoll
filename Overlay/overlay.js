// overlay.js
const socket = io("http://localhost:4000"); // Server-Adresse prüfen

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");

socket.on("connect", () => {
  console.log("Mit Overlay Server verbunden");
});

socket.on("updatePolls", (polls) => {
  const poll = polls[0];

  if (!poll) {
    questionEl.textContent = "";
    optionsEl.innerHTML = "";
    return;
  }

  // Stimmen zählen
  const counts = new Array(poll.options.length).fill(0);
  Object.values(poll.votes || {}).forEach(vote => counts[vote]++);

  questionEl.textContent = poll.question + (poll.closed ? " [CLOSED]" : "");
  optionsEl.innerHTML = "";

  poll.options.forEach((option, i) => {
    const li = document.createElement("li");
    li.textContent = `${option} - ${counts[i]} Stimmen`;
    optionsEl.appendChild(li);
  });
});
