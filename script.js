const tmi = require("tmi.js");
const pollHandler = require("./pollHandler");
const { startPoll, stopPoll, updateVotes, getCurrentPoll } = require("./Server");
require("dotenv").config();

// Twitch Bot Setup
const client = new tmi.Client({
  options: { debug: true },
  connection: { reconnect: true, secure: true },
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: process.env.TWITCH_CHANNELS.split(",")
});

// PollHandler mit Server-Funktionen verbinden
pollHandler.init({ startPoll, stopPoll, updateVotes, getCurrentPoll });

client.on("connected", (address, port) => {
  console.log(`Connected to ${address}:${port}`);
});

client.on("message", (channel, userstate, message, self) => {
  if (self) return;
  pollHandler.handlePollCommand(channel, userstate, message, client);
  console.log(`Received message: ${message} from ${userstate.username}`);

});


client.connect().catch(console.error);
