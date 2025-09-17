const socket = io();
const questionEl = document.getElementById("poll-question");
const optionsEl = document.getElementById("poll-options");

socket.on("updatePolls", (polls) => {
  if (!polls.length) {
    questionEl.textContent = "Waiting for poll...";
    optionsEl.innerHTML = "";
    return;
  }

  const poll = polls[0];
  questionEl.textContent = poll.question;
  optionsEl.innerHTML = "";

  poll.options.forEach(option => {
    const votes = Object.values(poll.votes)
      .flat()
      .filter(v => v.toLowerCase() === option.toLowerCase()).length;

    const li = document.createElement("li");
    li.textContent = `${option}: ${votes} vote${votes !== 1 ? "s" : ""}`;
    optionsEl.appendChild(li);
  });
});
