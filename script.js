const tmi = require("tmi.js");
const chalk = require("chalk");
require("dotenv").config();
const { execSync } = require("child_process");

const pollCommand = require("./commands/pollCommand.js");
const voteCommand = require("./commands/voteCommand.js");
const closeCommand = require("./commands/closePollCommand.js");
const clearCommand = require("./commands/clearPollCommand.js");
const listCommand = require("./commands/listPollsCommand.js");
const helpCommand = require("./commands/helpCommand.js");

let currentPoll = null;

try {
  console.log("🔍 Prüfe auf Updates...");
  execSync("node updater.js", { stdio: "inherit" });
} catch (err) {
  console.error("⚠️ Updater konnte nicht ausgeführt werden:", err.message);
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
  console.log(chalk.green(`[${new Date().toISOString()}] Bot started.`));
});

client.on("message", (channel, tags, message, self) => {
  if (self) return;

  const [cmd, ...args] = message.trim().split(" ");

  switch (cmd.toLowerCase()) {
    case "!poll":
      currentPoll = pollCommand.execute(client, channel, tags, args, currentPoll).currentPoll;
      break;
    case "!vote":
      currentPoll = voteCommand.execute(client, channel, tags, args, currentPoll).currentPoll;
      break;
    case "!close":
      currentPoll = closeCommand.execute(client, channel, tags, args, currentPoll).currentPoll;
      break;
    case "!clear":
      currentPoll = clearCommand.execute(client, channel, tags, args, currentPoll).currentPoll;
      break;
    case "!list":
      currentPoll = listCommand.execute(client, channel, tags, args, currentPoll).currentPoll;
      break;
    case "!help":
      currentPoll = helpCommand.execute(client, channel, tags, args, currentPoll).currentPoll;
      break;
  }
});

client.connect().catch(console.error);
