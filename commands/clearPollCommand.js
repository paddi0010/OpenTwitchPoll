const { updatePoll } = require("../Server.js");

module.exports = {
  name: "clear",
  execute(client, channel, tags, args, currentPoll) {
    currentPoll = null;
    client.say(channel, "✅ Poll cleared.");

    updatePoll(currentPoll);

    return { currentPoll };
  }
};
