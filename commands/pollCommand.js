module.exports = {
  name: "poll",
  description: "Startet eine neue Umfrage.",
  execute(client, channel, tags, args, currentPoll) {
  
    if (currentPoll && !currentPoll.closed) {
      client.say(channel, "⚠️ A poll is already running. Close it first with !poll close.");
      return { currentPoll, created: false };
    }

    if (args.length < 2) {
      client.say(channel, "⚠️ Usage: !poll <question> option1, option2, option3 ...");
      return { currentPoll, created: false };
    }

    const question = args[0];
    const options = args.slice(1).join(" ").split(",").map(o => o.trim()).filter(o => o.length > 0);

    if (options.length < 2) {
      client.say(channel, "⚠️ You need at least 2 options for the poll.");
      return { currentPoll, created: false };
    }

    const newPoll = {
      question,
      options,
      votes: {},
      closed: false,
      timer: null,
      remaining: null,
    };

    return { currentPoll: newPoll, created: true };
  },
};
