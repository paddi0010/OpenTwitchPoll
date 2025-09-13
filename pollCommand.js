const { addPoll, closePoll, clearPolls, polls, vote } = require("./Server.js");

function handlePollCommand(channel, tags, message, client) {
  const trimmed = message.trim();

  if (trimmed.startsWith("!poll ")) {
    const args = trimmed.split(" ").slice(1);
    if (!args.length) {
      return client.say(channel, "⚠️ Please enter a poll question! Example: !poll <Question>");
    }

    const questionText = args.join(" ");
    if (polls.some(p => p.question === questionText && !p.closed)) {
      return client.say(channel, `⚠️ Poll already exists: "${questionText}"`);
    }

    addPoll(tags.username, questionText);
    client.say(channel, `✅ Poll added by @${tags.username}: "${questionText}"`);
  }

  else if (trimmed.startsWith("!poll edit ")) {
    const args = trimmed.split(" ").slice(2);
    if (args.length < 2 || isNaN(args[0])) {
      return client.say(channel, "⚠️ Please provide the number and the new question! Example: !poll edit 1 New Question");
    }

    const index = parseInt(args[0]) - 1;
    const newQuestion = args.slice(1).join(" ");

    if (!polls[index]) {
      return client.say(channel, `⚠️ Poll No. ${args[0]} does not exist.`);
    }

    polls[index].question = newQuestion;
    client.say(channel, `✅ Poll No. ${args[0]} has been edited: "${newQuestion}"`);
  }

  else if (trimmed.startsWith("!close ")) {
    const args = trimmed.split(" ").slice(1);
    if (!args.length || isNaN(args[0])) {
      return client.say(channel, "⚠️ Please provide the poll number! Example: !close 1");
    }

    const index = parseInt(args[0]) - 1;
    if (!polls[index]) {
      return client.say(channel, `⚠️ Poll No. ${args[0]} does not exist.`);
    }

    const success = closePoll(index);
    if (success) {
      client.say(channel, `✅ Poll No. ${args[0]} closed.`);
    } else {
      client.say(channel, `⚠️ Poll No. ${args[0]} is already closed.`);
    }
  }

  else if (trimmed === "!clear polls") {
    clearPolls();
    client.say(channel, "✅ All polls have been deleted.");
  }

  else if (trimmed === "!polls") {
    const openPolls = polls.filter(p => !p.closed);
    if (!openPolls.length) {
      return client.say(channel, "📋 There are currently no polls.");
    }

    const pollList = openPolls.map((p, i) => `${i + 1}. ${p.user}: ${p.question}`).join(" | ");
    client.say(channel, `📋 Current polls: ${pollList}`);
  }
}

module.exports = { handlePollCommand };
