const { updatePoll } = require("../Server.js");

module.exports = {
  name: "vote",
  execute(client, channel, tags, args, currentPoll) {
    if (!currentPoll) {
      client.say(channel, "❌ No active poll right now.");
      return { currentPoll };
    }

    const choice = parseInt(args[0], 10) - 1;
    if (isNaN(choice) || choice < 0 || choice >= currentPoll.options.length) {
      client.say(channel, "❌ Invalid vote. Use the number of an option.");
      return { currentPoll };
    }

    // Votes as a Map: userId -> choice
    if (!currentPoll.votes) currentPoll.votes = {};
    
    currentPoll.votes[tags["user-id"]] = choice;

    client.say(
      channel,
      `✅ ${tags["display-name"]} voted for "${currentPoll.options[choice]}"`
    );

    updatePoll(currentPoll);

    return { currentPoll };
  }
};
