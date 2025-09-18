module.exports = {
  name: "close",
  description: "Close the current poll",
  execute(client, channel, tags, args, currentPoll) {
    if (!currentPoll) {
      client.say(channel, "⚠️ No poll to close.");
      return { currentPoll };
    }

    if (currentPoll.closed) {
      client.say(channel, "⚠️ The poll is already closed.");
      return { currentPoll };
    }

    currentPoll.closed = true;

    // Ergebnis zählen
    const results = {};
    for (const vote of Object.values(currentPoll.votes)) {
      results[vote] = (results[vote] || 0) + 1;
    }

    const resultString = Object.entries(results)
      .map(([opt, count]) => `${opt}: ${count}`)
      .join(" | ");

    client.say(channel, `📊 Poll closed! Results: ${resultString}`);
    return { currentPoll };
  }
};
