const tmi = require("tmi.js");
require("dotenv").config();
const { io } = require("socket.io-client");
const pollCommand = require("./commands/pollCommand.js");
const voteCommand = require("./commands/voteCommand.js");
const closeCommand = require("./commands/closePollCommand.js");
const clearCommand = require("./commands/clearPollCommand.js");
const listCommand = require("./commands/listPollsCommand.js");
const helpCommand = require("./commands/helpCommand.js");

let currentPoll = null;

const overlaySocket = io("http://localhost:4000");

function sendUpdate() {
  overlaySocket.emit("updatePolls", currentPoll ? [currentPoll] : []);
}

const client = new tmi.Client({
  options: { debug: true },
  connection: { reconnect: true, secure: true },
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: [process.env.TWITCH_CHANNELS]
});

client.on("connected", () => {
  console.log("Bot gestartet");
});

client.on("message", (channel, tags, message, self) => {
  if (self) return;

  const [cmd, ...args] = message.trim().split(" ");

  switch (cmd.toLowerCase()) {
    case "!poll":
  if (args.length === 0) {
    currentPoll = pollCommand.execute(client, channel, tags, args, currentPoll).currentPoll;
    sendUpdate();
  } else {
    const subcmd = args[0].toLowerCase();

    switch (subcmd) {
      case "list":
        currentPoll = listCommand.execute(client, channel, tags, args.slice(1), currentPoll).currentPoll;
        break;
      case "close":
        if (!currentPoll) {
          client.say(channel, "⚠️ No poll is currently running.");
        } else {
          currentPoll = closeCommand.execute(client, channel, tags, args.slice(1), currentPoll).currentPoll;
          sendUpdate();
        }
        break;
      default:
        currentPoll = pollCommand.execute(client, channel, tags, args, currentPoll).currentPoll;
        sendUpdate();
    }
  }
  break;


    case "!vote":
      currentPoll = voteCommand.execute(client, channel, tags, args, currentPoll).currentPoll;
      sendUpdate();
      break;
  }
});


client.connect().catch(console.error);
