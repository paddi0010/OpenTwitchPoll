const { addTask, markTaskDone, clearTasks, tasks } = require("./Server");

function handleTaskCommand(channel, tags, message, client) {
  const trimmed = message.trim();

  // 1️⃣ Neue Aufgabe hinzufügen
  if (trimmed.startsWith("!task ")) {
    const args = trimmed.split(" ").slice(1);
    if (!args.length) {
      return client.say(channel, "⚠️ Please enter a task! Example: !task <Task>");
    }

    const taskText = args.join(" ");

    // Doppeltes Task verhindern
    if (tasks.some(t => t.task === taskText && !t.done)) {
      return client.say(channel, `⚠️ Task already exists: "${taskText}"`);
    }

    addTask(tags.username, taskText);
    client.say(channel, `✅ Task added by @${tags.username}: "${taskText}"`);
  }

  // 2️⃣ Task edit
  else if (trimmed.startsWith("!task edit ")) {
    const args = trimmed.split(" ").slice(2);
    if (args.length < 2 || isNaN(args[0])) {
      return client.say(channel, "⚠️ Please provide the number and the new text! Example: !task edit 1 New Text");
    }

    const index = parseInt(args[0]) - 1;
    const newText = args.slice(1).join(" ");

    if (!tasks[index]) {
      return client.say(channel, `⚠️ Task No. ${args[0]} does not exist.`);
    }

    tasks[index].task = newText;
    client.say(channel, `✅ Task No. ${args[0]} has been edited: "${newText}"`);
  }

  // 3️⃣ Aufgabe als erledigt markieren
  else if (trimmed.startsWith("!done ")) {
    const args = trimmed.split(" ").slice(1);
    if (!args.length || isNaN(args[0])) {
      return client.say(channel, "⚠️ Please provide the task number! Example: !done 1");
    }

    const index = parseInt(args[0]) - 1;

    if (!tasks[index]) {
      return client.say(channel, `⚠️ Aufgabe Nr. ${args[0]} existiert nicht.`);
    }

    const success = markTaskDone(index);
    if (success) {
      client.say(channel, `✅ Task No. ${args[0]} completed and marked.`);
    } else {
      client.say(channel, `⚠️ Task No. ${args[0]} is already completed.`);
    }
  }

  // 4️⃣ Alle Aufgaben löschen
  else if (trimmed === "!clear list") {
    clearTasks();
    client.say(channel, "✅ All tasks have been deleted.");
  }

  // 5️⃣ Aufgaben auflisten (nur offene)
  else if (trimmed === "!tasks") {
    const openTasks = tasks.filter(t => !t.done);

    if (!openTasks.length) {
      return client.say(channel, "📋 There are currently no tasks.");
    }

    const taskList = openTasks
      .map((t, i) => `${i + 1}. ${t.user}: ${t.task}`)
      .join(" | ");

    client.say(channel, `📋 Current tasks: ${taskList}`);
  }
}

module.exports = { handleTaskCommand };
