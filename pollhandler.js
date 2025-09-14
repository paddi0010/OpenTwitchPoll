// pollHandler.js
let serverFuncs = {};

function init(funcs) {
  serverFuncs = funcs;
}

function handlePollCommand(channel, userstate, message, client) {
  const trimmed = message.trim();

  // !poll start Befehl
  if (trimmed.startsWith("!poll start ")) {
    const payload = trimmed.slice(12).trim(); // alles nach !poll start

    // Frage und Optionen trennen: alles vor erstem ? ist Frage, danach Optionen
    const questionMatch = payload.match(/^(.*?\?)\s*(.*)$/);
    if (!questionMatch) {
      client.say(channel, '⚠️ Usage: !poll start <Question>? <Option1>, <Option2>, ...');
      return;
    }

    const question = questionMatch[1].trim();
    const optionsPart = questionMatch[2].trim();

if (!optionsPart) {
  client.say(channel, '⚠️ Please provide options separated by commas.');
  return;
}

const options = optionsPart.split(",").map(o => o.trim());

const newPoll = { question, options, votes: {} };

serverFuncs.startPoll(newPoll);
client.say(channel, `🗳️ New poll started: ${question} | Options: ${options.join(", ")}`);

  }

  // !vote Befehl
  else if (trimmed.startsWith("!vote ")) {
    const choice = trimmed.slice(6).trim().toLowerCase();
    const poll = serverFuncs.getCurrentPoll();

    if (!poll) {
      client.say(channel, "⚠️ No active poll.");
      return;
    }

    if (!poll.options.map(o => o.toLowerCase()).includes(choice)) {
      client.say(channel, `⚠️ Invalid option. Choose from: ${poll.options.join(", ")}`);
      return;
    }

    // Mehrfachvoting möglich
    if (!poll.votes[userstate.username]) poll.votes[userstate.username] = [];
    poll.votes[userstate.username].push(choice);

    serverFuncs.updateVotes(poll);
    client.say(channel, `✅ @${userstate.username} voted for "${choice}"`);
  }
}

module.exports = { init, handlePollCommand };
