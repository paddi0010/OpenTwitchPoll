const { updatePoll } = require("../Server");

module.exports = {
  name: "close",
  execute(client, channel, tags, args, currentPoll) {
    if (!currentPoll && !currentPoll.closed) {
      return { currentPoll };
    }

    currentPoll.closed = true;

    const counts = new Array(currentPoll.options.length).fill(0);
    Object.values(currentPoll.votes || {}).forEach(vote => counts[vote]++);

    const results = currentPoll.options.map((opt, i) => `${opt}: ${counts[i]}`).join(" | ");

    client.say(channel, `📊 Poll closed: ${currentPoll.question} | ${results}`);

    updatePoll(currentPoll);
    currentPoll = null;

    return { currentPoll };
  }
};
