module.exports = {
  name: "vote",
  description: "Vote in the current poll",
  execute(client, channel, tags, args, currentPoll) {
    if (!currentPoll || currentPoll.closed) {
      client.say(channel, "⚠️ No poll is currently running.");
      return { currentPoll };
    }

    const vote = args[0]?.toLowerCase();
    if (!vote || !currentPoll.options.includes(vote)) {
      client.say(channel, `⚠️ Invalid vote. Options: ${currentPoll.options.join(", ")}`);
      return { currentPoll };
    }

    currentPoll.votes[tags.username] = vote;
    client.say(channel, `✅ @${tags.username} voted for "${vote}"`);
    return { currentPoll };
  }
};
