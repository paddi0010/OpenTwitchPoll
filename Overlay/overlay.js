const socket = io("http://localhost:3000");
const taskList = document.getElementById("task-list");
const taskTimeouts = {};

socket.on("updateTasks", tasks => {
  taskList.innerHTML = "";

  tasks.forEach((t, i) => {
    const li = document.createElement("li");
    li.classList.add("visible");

    const container = document.createElement("div");
    container.className = "task-container";

    const numberSpan = document.createElement("span");
    numberSpan.className = "task-number";
    numberSpan.textContent = t.done ? "✔" : i + 1;

    const contentSpan = document.createElement("span");
    contentSpan.className = "task-content";
    contentSpan.textContent = `${t.user}: ${t.task}`;

    container.appendChild(numberSpan);
    container.appendChild(contentSpan);
    li.appendChild(container);
    taskList.appendChild(li);

    if (t.done && !taskTimeouts[t.id]) {
      container.classList.add("done");
      container.classList.add("pop");
      container.addEventListener("animationend", () => container.classList.remove("pop"), { once: true });

      // Aufgabe nach 60 Sekunden animiert verschwinden lassen
      taskTimeouts[t.id] = setTimeout(() => {
        container.classList.add("swipe-out");
        container.addEventListener("transitionend", () => li.remove(), { once: true });
        delete taskTimeouts[t.id];
      }, 60000);
    }
  });
});
