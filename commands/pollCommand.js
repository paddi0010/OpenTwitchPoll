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
      client.say(channel, "⚠️ Invalid poll format. Use: !poll <question>? <option1>, <option2>, ... [timer]");
      return { currentPoll };
    }

    const question = input[0].trim() + "?";
    let optionsStr = input[1].trim();

    // Prüfen, ob letzte „Option“ eine Zahl (Timer) ist
    let timer = 60; // default
    const lastSpaceIndex = optionsStr.lastIndexOf(" ");
    const lastPart = optionsStr.slice(lastSpaceIndex + 1);
    if (!isNaN(parseInt(lastPart))) {
      timer = parseInt(lastPart);
      optionsStr = optionsStr.slice(0, lastSpaceIndex); // Zahl aus Optionen entfernen
    }

    const options = optionsStr
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
      closed: false,
    };
    return { currentPoll };
  }
};
