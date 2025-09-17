module.exports = {
  name: "list",
  description: "List current poll and options",
  execute(client, channel, tags, args, currentPoll) {
    if (!currentPoll) {
      client.say(channel, "📋 No poll is currently running.");
      return { currentPoll };
    }

    const voteCounts = {};
    for (const opt of currentPoll.options) voteCounts[opt] = 0;
    for (const vote of Object.values(currentPoll.votes)) voteCounts[vote]++;

    const results = currentPoll.options.map(opt => `${opt}: ${voteCounts[opt]}`).join(" | ");
    client.say(channel, `📋 Current poll: ${currentPoll.question} | ${results}`);
    return { currentPoll };
  }
};
