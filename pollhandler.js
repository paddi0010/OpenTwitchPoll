const pollState = require("./pollState");
const ioClient = require("socket.io-client");
const socket = ioClient("http://localhost:3000"); // Overlay-Server

function handlePollCommand(channel, userstate, message, client) {
  const lowerMsg = message.toLowerCase();

  // --- Start poll ---
  if (lowerMsg.startsWith("!poll start")) {
    if (pollState.isActive()) {
      client.say(channel, "⚠️ A poll is already running!");
      return;
    }

    const pollArgs = message.slice(11).trim();
    const questionEndIndex = pollArgs.lastIndexOf("?");
    if (questionEndIndex === -1) {
      client.say(channel, "❌ Please end your question with a '?'");
      return;
    }

    const question = pollArgs.slice(0, questionEndIndex + 1).trim();
    const optionsString = pollArgs.slice(questionEndIndex + 1).trim();
    const options = optionsString.split(",").map(opt => opt.trim()).filter(Boolean);

    if (options.length < 2) {
      client.say(channel, "❌ Please provide at least 2 options.");
      return;
    }

    pollState.startPoll(question, options);
    client.say(channel, `🗳️ New poll started: ${question} | Options: ${options.join(", ")}`);

    // Send poll to overlay
    socket.emit("updatePolls", [{
      question,
      options,
      votes: {}
    }]);
    return;
  }

  // --- Vote ---
  else if (lowerMsg.startsWith("!vote")) {
    const args = message.split(" ");
    const optionInput = args.slice(1).join(" ");
    const success = pollState.vote(userstate.username, optionInput);

    if (!success) {
      client.say(channel, `❌ Invalid vote or no active poll. Enter option exactly as shown.`);
      return;
    }

    const results = pollState.getResults();
    const optionKey = optionInput.trim().toLowerCase();
    const count = results.results[optionKey] || 0;

    client.say(channel, `✅ @${userstate.username} voted for "${optionInput}"! Current votes: ${count}`);

    // Update overlay
    socket.emit("updatePolls", [{
      question: results.question,
      options: results.options,
      votes: results.results
    }]);
    return;
  }

  // --- Stop poll ---
  else if (lowerMsg.startsWith("!poll stop")) {
    if (!pollState.isActive()) {
      client.say(channel, "⚠️ No active poll.");
      return;
    }

    const result = pollState.stopPoll();
    const tally = {};
    result.options.forEach(opt => {
      tally[opt] = Object.values(result.votes).filter(v => v === opt).length;
    });

    const resultString = Object.entries(tally).map(([opt, count]) => `${opt}: ${count}`).join(" | ");
    client.say(channel, `📊 Results: ${result.question} → ${resultString}`);

    // Clear overlay
    socket.emit("updatePolls", []);
  }
}

module.exports = { handlePollCommand };
