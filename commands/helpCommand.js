module.exports = {
  name: "help",
  description: "Show all available command",
  execute(client, channel, tags, args, currentPoll) {
    client.say(channel, "Commands: !poll, !vote, !close, !clear, !list, !help");
    return { currentPoll };
  }
};
