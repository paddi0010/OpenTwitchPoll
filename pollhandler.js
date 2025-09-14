module.exports = (serverFuncs) => {
  function handlePollCommand(channel, userstate, message, client) {
  
    const cleanedMessage = message.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
    const isModOrBroadcaster = userstate.mod || userstate.badges?.broadcaster;

    function sanitize(str) {
      return str.replace(/[\u200B-\u200D\uFEFF]/g, "").trim().toLowerCase();
    }

    // --- Poll Start ---
    if (cleanedMessage.startsWith("!poll start ")) {
      if (!isModOrBroadcaster) {
        client.say(channel, `⚠️ Only the broadcaster or a moderator can start a poll.`);
        return;
      }

      const payload = cleanedMessage.slice(12).trim();
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

      const options = optionsPart.split(",").map(o => o.trim().toLowerCase());
      const newPoll = { question, options, votes: {} };

      serverFuncs.startPoll(newPoll);
      client.say(channel, `🗳️ New poll started: ${question} | Options: ${options.join(", ")}`);
      return; // fertig mit Poll start
    }

    // --- Vote Command ---
    if (cleanedMessage.startsWith("!vote ")) {
      const poll = serverFuncs.getCurrentPoll();
      if (!poll) {
        client.say(channel, "⚠️ No active poll.");
        return;
      }

      const choice = sanitize(cleanedMessage.slice(6));
      const normalizedOptions = poll.options.map(o => sanitize(o));

      if (!normalizedOptions.includes(choice)) {
        client.say(channel, `⚠️ Invalid option. Choose from: ${poll.options.join(", ")}`);
        return;
      }

      if (!poll.votes[userstate.username]) poll.votes[userstate.username] = [];
      poll.votes[userstate.username].push(choice);

      serverFuncs.updateVotes(poll);
      client.say(channel, `✅ @${userstate.username} voted for "${choice}"`);
    }
  }

  return { handlePollCommand };
};
