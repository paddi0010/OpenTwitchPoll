const socket = io("http://localhost:4000");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");

socket.on("connect", () => {
  console.log("Mit Overlay Server verbunden");
});

socket.on("updatePolls", (polls) => {
  const poll = polls[0];
  if (!poll) {
    questionEl.textContent = "Keine Umfrage aktiv";
    optionsEl.innerHTML = "";
    return;
  }

  const counts = new Array(poll.options.length).fill(0);
  Object.values(poll.votes || {}).forEach(vote => {
    counts[vote]++;
  });

  console.log("Poll:", poll.question, counts);

  questionEl.textContent = poll.question;

  optionsEl.innerHTML = "";
  poll.options.forEach((option, i) => {
    const li = document.createElement("li");
    li.textContent = `${option} - ${counts[i]} Stimmen`;
    optionsEl.appendChild(li);
  });
});
