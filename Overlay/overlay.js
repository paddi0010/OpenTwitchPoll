const optionsList = document.getElementById("options");
const questionEl = document.getElementById("question");

const socket = io("http://localhost:3000"); // Socket.IO-Verbindung

socket.on("connect", () => console.log("Connected to server!"));

socket.on("updatePolls", (polls) => {
    const data = polls[0]; // wir gehen aktuell von nur 1 Poll aus

    if (!data) {
        questionEl.textContent = "No active poll";
        optionsList.innerHTML = "";
        return;
    }

    questionEl.textContent = data.question;

    optionsList.innerHTML = "";
    data.options.forEach(opt => {
        const li = document.createElement("li");
        li.textContent = `${opt} : ${data.votes[opt] || 0}`;
        optionsList.appendChild(li);
    });
});
