const { startPoll } = require("../Server.js");

module.exports = {
  name: "poll",
  execute(client, channel, tags, args, currentPoll) {
    if (currentPoll) return { currentPoll };

    const message = args.join(" ");
    const [questionPart, optionsPart] = message.split("?");
    if (!optionsPart) return { currentPoll };

    const question = questionPart.trim() + "?";
    const options = optionsPart.split(",").map(o => o.trim());

    const newPoll = { question, options, votes: {} };

    startPoll(newPoll); // ← Wichtig, Overlay bekommt das Event
    client.say(channel, `🗳️ New poll started: ${question} | Options: ${options.join(", ")}`);

    return { currentPoll: newPoll };
  }
};
