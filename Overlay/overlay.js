const socket = io("http://localhost:4000");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");

socket.on("connect", () => console.log("Mit Overlay Server verbunden"));

socket.on("updatePolls", (polls) => {
  const poll = polls[0];

  if (!poll) {
    questionEl.textContent = "";
    optionsEl.innerHTML = "";
    if (timerEl) timerEl.textContent = "";
    return;
  }

  questionEl.textContent = poll.question + (poll.closed ? " [CLOSED]" : "");
  optionsEl.innerHTML = "";

  poll.options.forEach(option => {
    const li = document.createElement("li");
    const votes = poll.votes[option] || 0;
    li.textContent = `${option} - ${votes} Stimmen`;
    optionsEl.appendChild(li);
  });

  if (timerEl) timerEl.textContent = poll.closed ? "Poll closed" : `Time left: ${poll.remaining}s`;
});
