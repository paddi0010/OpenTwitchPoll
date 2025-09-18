const socket = io("http://localhost:4000"); // Muss zu deinem Server-Port passen

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");

socket.on("connect", () => {
  console.log("Mit Overlay Server verbunden");
});

socket.on("updatePolls", (polls) => {
  const poll = polls[0]; // nur die aktuelle Umfrage anzeigen

  if (!poll) {
    questionEl.textContent = "Keine Umfrage aktiv";
    optionsEl.innerHTML = "";
    return;
  }

  questionEl.textContent = poll.question;
  optionsEl.innerHTML = "";

  for (const option of poll.options) {
    const li = document.createElement("li");
    const votes = poll.votes[option] || 0;
    li.textContent = `${option} - ${votes} Stimmen`;
    optionsEl.appendChild(li);
  }
});
