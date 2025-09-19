module.exports = {
  name: "poll",
  description: "Start a new poll",
  execute(client, channel, tags, args, currentPoll) {
    if (currentPoll && !currentPoll.closed) {
      client.say(channel, "⚠️ A poll is already running. Close it first with !poll close.");
      return { currentPoll };
    }

    const input = args.join(" ").split("?");
    if (input.length < 2) {
      client.say(channel, "⚠️ Invalid poll format. Use: !poll <question>? <option1>, <option2>, ...");
      return { currentPoll };
    }

    const question = input[0].trim() + "?";
    const options = input[1]
      .split(",")
      .map(o => o.trim())
      .filter(o => o.length > 0);

    if (options.length < 2) {
      client.say(channel, "⚠️ You must provide at least 2 options for a poll.");
      return { currentPoll };
    }

    currentPoll = {
      question,
      options,
      votes: {},
      closed: false
    };

    client.say(channel, `🗳️ New poll started: ${question} | Options: ${options.join(", ")}`);
    return { currentPoll };
  }
};
