const express = require("express");
const open = require("open").default || require("open");
const readline = require("readline");
const fetch = require("node-fetch");
const fs = require("fs");
const { spawn } = require("child_process");
const dotenv = require("dotenv");

dotenv.config({ path: "env_start" });

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3001/callback";
const SCOPES = ["chat:read", "chat:edit"].join(" ");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function startAuth() {
  return new Promise(resolve => {
    rl.question("Twitch Username: ", username => resolve(username));
  });
}

async function run() {
  const username = await startAuth();
  const app = express();

  // OAuth-Server
  const server = app.listen(3001, () => console.log("OAuth Server läuft auf http://localhost:3001"));

  app.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send("Kein Code erhalten!");

    try {
      const tokenResp = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri: REDIRECT_URI
        })
      });

      const tokenData = await tokenResp.json();
      const accessToken = tokenData.access_token;
      if (!accessToken) return res.send("Token konnte nicht abgerufen werden!");

      const envContent =
        `TWITCH_USERNAME=${username}\n` +
        `TWITCH_CHANNELS=${username}\n` +
        `TWITCH_OAUTH_TOKEN=${accessToken}\n`;

      fs.writeFileSync(".env", envContent);
      console.log("✅ .env erstellt!");

      res.send("✅ Token erhalten! Fenster kann geschlossen werden.");

      server.close();
      rl.close();

      const bot = spawn("node", ["./script.js"], { stdio: "inherit" });

      console.log("Starte Overlay-Server manuell: node server.js");

    } catch (err) {
      console.error(err);
      res.send("Fehler beim Abrufen des Tokens");
    }
  });

  const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}` +
                  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
                  `&response_type=code&scope=${encodeURIComponent(SCOPES)}`;
  open(authUrl);
}

run();
