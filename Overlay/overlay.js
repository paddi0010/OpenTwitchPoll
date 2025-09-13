const optionsList = document.getElementById("options");
const questionEl = document.getElementById("question");

async function fetchPoll() {
    try {
        const res = await fetch("http://localhost:3000/poll");
        const data = await res.json();

        if (!data || !data.question) {
            questionEl.textContent = "Keine aktive Umfrage";
            optionsList.innerHTML = "";
            return;
        }

        questionEl.textContent = data.question;

        optionsList.innerHTML = "";
        data.options.forEach(opt => {
            const li = document.createElement("li");
            li.textContent = `${opt} : ${data.results[opt] || 0}`;
            optionsList.appendChild(li);
        });
    } catch (err) {
        console.error("Fehler beim Laden der Umfrage.", err);
    }
}

setInterval(fetchPoll, 2000);
fetchPoll();