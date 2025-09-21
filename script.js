const tmi = require("tmi.js");
require("dotenv").config();
const pollCommand = require("./commands/pollCommand.js");
const voteCommand = require("./commands/voteCommand.js");
const closeCommand = require("./commands/closePollCommand.js");
const clearCommand = require("./commands/clearPollCommand.js");
const listCommand = require("./commands/listPollsCommand.js");

const { updatePoll } = require("./Server.js");

let currentPoll = null;
let timerInterval = null;

const client = new tmi.Client({
  options: { debug: true },
  connection: { reconnect: true, secure: true },
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN,
  },
  channels: [process.env.TWITCH_CHANNELS],
});

client.on("connected", () => {
  console.log("Bot gestartet");
});

function startTimer(channel) {
  if (!currentPoll || !currentPoll.timer) return;

  if (timerInterval) clearInterval(timerInterval);

  currentPoll.remaining = currentPoll.timer;
  updatePoll(currentPoll);

  timerInterval = setInterval(() => {
    if (!currentPoll || currentPoll.closed) {
      clearInterval(timerInterval);
      return;
    }

    currentPoll.remaining--;
    updatePoll(currentPoll);

    if (currentPoll.remaining <= 0) {
      clearInterval(timerInterval);
      currentPoll.closed = true;
      updatePoll(currentPoll);
      client.say(channel, "⏰ Poll auto-closed! Time is up.");
      currentPoll = null;
      updatePoll(null);
    }
  }, 1000);
}

client.on("message", (channel, tags, message, self) => {
  if (self) return;

  const [cmd, ...args] = message.trim().split(" ");

  switch (cmd.toLowerCase()) {
    case "!poll":
      if (args.length === 0) {
        const result = pollCommand.execute(client, channel, tags, args, currentPoll);
        if (result) currentPoll = result.currentPoll;
        updatePoll(currentPoll);
      } else {
        const subcmd = args[0].toLowerCase();

        switch (subcmd) {
          case "list":
            const listResult = listCommand.execute(client, channel, tags, args.slice(1), currentPoll);
            if (listResult) currentPoll = listResult.currentPoll;
            break;

          case "close":
            if (!currentPoll) {
              client.say(channel, "⚠️ No poll is currently running.");
            } else {
              const closeResult = closeCommand.execute(client, channel, tags, args.slice(1), currentPoll);
              if (closeResult) currentPoll = closeResult.currentPoll;
              updatePoll(currentPoll);
              if (timerInterval) clearInterval(timerInterval);
            }
            break;

          case "clear":
            const clearResult = clearCommand.execute(client, channel, tags, args.slice(1), currentPoll);
            if (clearResult) currentPoll = clearResult.currentPoll;
            updatePoll(currentPoll);
            if (timerInterval) clearInterval(timerInterval);
            break;

          default:
            let pollArgs = [...args];
            let timerValue;
            const lastArg = pollArgs[pollArgs.length - 1];
            if (!isNaN(parseInt(lastArg))) {
              timerValue = parseInt(lastArg);
              pollArgs.pop();
            }

            // starting poll
            const pollResult = pollCommand.execute(
              client,
              channel,
              tags,
              pollArgs,
              currentPoll
            );
            if (pollResult) currentPoll = pollResult.currentPoll;

            if (currentPoll && timerValue) {
              if (timerValue) {
                currentPoll.timer = timerValue;
                currentPoll.remaining = timerValue;
                startTimer(channel);
              }

              // Chatnachricht mit korrektem Timer
              client.say(channel, `🗳️ New poll started: ${currentPoll.question} | Options: ${currentPoll.options.join(", ")}${timerValue ? ` | Auto-close in ${timerValue}s` : ""}`);
              updatePoll(currentPoll);
            }
        }
      }
      break;

    case "!vote":
      const voteResult = voteCommand.execute(client, channel, tags, args, currentPoll);
      if (voteResult) currentPoll = voteResult.currentPoll;
      updatePoll(currentPoll);
      break;
  }
});

client.connect().catch(console.error);
