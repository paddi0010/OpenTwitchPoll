const tmi = require("tmi.js");
const taskcommandHandler = require("./pollCommand.js");

require('dotenv').config();

const client = new tmi.Client({
  options: {
    debug: true,
    connection: {
        reconnect: true,
        secure: true,
    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    },
    channel: process.env.TWITCH_CHANNELS.split(",")
    }
  }
});

client.on("connected", (address, port) => {
  console.log(`Connected to ${address}:${port}`);
});

client.on("message", (channel, userstate, self) => {
    if (self) return;

taskcommandHandler.handleTaskCommand(channel, userstate, message, client); 
});

client.connect().catch(console.error);
