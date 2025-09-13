const pollState = require("./pollState");

function handlePollCommand(channel, userstate, message, client) {
  const lowerMsg = message.toLowerCase();

  // --- Start a poll ---
  if (lowerMsg.startsWith("!poll start")) {
    if (pollState.isActive()) {
      client.say(channel, "⚠️ A poll is already running!");
      return;
    }

    const pollArgs = message.slice(11).trim(); // after "!poll start"
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
    return;
  }

  // --- Cast a vote ---
  else if (lowerMsg.startsWith("!vote")) {
    const args = message.split(" ");
    const optionInput = args.slice(1).join(" "); // capture the entire option
    const success = pollState.vote(userstate.username, optionInput);

    if (!success) {
      client.say(channel, `❌ Invalid vote or no active poll. Please enter the option exactly as shown.`);
      return;
    }

    // --- Confirmation + current vote count ---
    const results = pollState.getResults();
    const optionKey = optionInput.trim().toLowerCase(); // corresponds to key in pollState
    const count = results.results[optionKey] || 0;

    client.say(channel, `✅ @${userstate.username} voted for "${optionInput}"! Current votes: ${count}`);
    return;
  }

  // --- Stop the poll ---
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
  }
}

module.exports = { handlePollCommand };
