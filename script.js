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
            let lastArgRaw = pollArgs[pollArgs.length - 1];
            let lastArgClean = lastArgRaw.replace(/[^\d]/g, "").trim(); 

            if (lastArgClean && !isNaN(parseInt(lastArgClean))) {
              timerValue = parseInt(lastArgClean);
              pollArgs.pop();
            }


            // start poll
            const pollResult = pollCommand.execute(client, channel, tags, pollArgs, currentPoll);

            if (pollResult && pollResult.currentPoll && pollResult.created) {
              currentPoll = pollResult.currentPoll;

              if (timerValue) {
                currentPoll.timer = timerValue;
                currentPoll.remaining = timerValue;

                client.say(channel,`🗳️ New poll started: ${currentPoll.question} | Options: ${currentPoll.options.join( ", ")} | Auto-close in ${timerValue}s`);

                startTimer(channel);
              } else {
                client.say(channel, `🗳️ New poll started: ${currentPoll.question} | Options: ${currentPoll.options.join(", ")}`);
              }

              updatePoll(currentPoll);
            }
            break;
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
