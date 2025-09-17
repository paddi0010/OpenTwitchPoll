module.exports = {
  name: "clear",
  description: "Clear the current poll",
  execute(client, channel, tags, args, currentPoll) {
    currentPoll = null;
    client.say(channel, "✅ Poll cleared.");
    return { currentPoll };
  }
};
