module.exports = {
  name: "list",
  description: "List current poll and options",
  execute(client, channel, tags, args, currentPoll) {
    if (!currentPoll) {
      client.say(channel, "📋 No poll is currently running.");
      return { currentPoll };
    }

    const counts = new Array(currentPoll.options.length).fill(0);
    Object.values(currentPoll.votes || {}).forEach(voteIndex => {
      counts[voteIndex]++;
    });

    const results = currentPoll.options
      .map((opt, i) => `${opt}: ${counts[i]}`)
      .join(" | ");

    client.say(channel, `📋 Current poll: ${currentPoll.question} | ${results}`);
    return { currentPoll };
  }
};
