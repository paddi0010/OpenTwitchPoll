const tmi = require("tmi.js");
const { startPoll, stopPoll, updateVotes, getCurrentPoll } = require("./Server");
const pollHandler = require("./pollHandler")({ startPoll, stopPoll, updateVotes, getCurrentPoll });
require("dotenv").config();
const open = require("open");


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

client.on("connected", (address, port) => {
  console.log(`Connected to ${address}:${port}`);
});

client.on("message", (channel, userstate, message, self) => {
  if (self) return;
  pollHandler.handlePollCommand(channel, userstate, message, client);
});


client.connect().catch(console.error);
