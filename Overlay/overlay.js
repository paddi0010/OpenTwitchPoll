const socket = io(); // verbindung zum Server

socket.on("updatePolls", (polls) => {
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");

  if (!polls.length) {
    questionEl.textContent = "No active poll";
    optionsEl.innerHTML = "";
    return;
  }

  const poll = polls[0];
  questionEl.textContent = poll.question;

  optionsEl.innerHTML = "";
  const voteCounts = {};
  Object.values(poll.votes).forEach(v => {
    if (Array.isArray(v)) v.forEach(choice => voteCounts[choice] = (voteCounts[choice] || 0) + 1);
    else voteCounts[v] = (voteCounts[v] || 0) + 1;
  });

  poll.options.forEach(option => {
    const li = document.createElement("li");
    li.textContent = `${option} - ${voteCounts[option.toLowerCase()] || 0} votes`;
    optionsEl.appendChild(li);
  });
});
