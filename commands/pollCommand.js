const { updatePoll } = require("../Server.js");

module.exports = {
  name: "poll",
  execute(client, channel, tags, args, currentPoll) {
    // Wenn noch eine aktive Poll läuft, blockieren
    if (currentPoll && !currentPoll.closed) return { currentPoll };

    const message = args.join(" ");
    const [questionPart, optionsPart] = message.split("?");
    if (!optionsPart) return { currentPoll };

    const question = questionPart.trim() + "?";
    const options = optionsPart.split(",").map(o => o.trim());

    const newPoll = { question, options, votes: {}, closed: false };

    currentPoll = newPoll;

    // Overlay sofort updaten
    updatePoll(currentPoll);

    client.say(channel, `🗳️ New poll started: ${question} | Options: ${options.join(", ")}`);

    return { currentPoll };
  }
};
