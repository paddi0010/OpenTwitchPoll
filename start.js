// start.js
const express = require("express");
const open = require("open");
const readline = require("readline");
const fetch = require("node-fetch");
const fs = require("fs");
const { spawn } = require("child_process");


require('dotenv').config( {path: './env_start'} );
console.log('CLIENT_ID:', process.env.TWITCH_CLIENT_ID);
console.log('CLIENT_SECRET:', process.env.TWITCH_CLIENT_SECRET);


const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

const REDIRECT_URI = "http://localhost:3000/callback";
const SCOPES = ["chat:read", "chat:edit"].join(" ");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Twitch Username: ", (username) => {

  const app = express();
  const server = app.listen(3000, () => {
    console.log("Server läuft auf http://localhost:3000");
  });

  // OAuth Callback
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

      // ✅ .env schreiben
      fs.writeFileSync(".env",
        `TWITCH_USERNAME=${username}\nTWITCH_CHANNELS=${username}\nTWITCH_OAUTH_TOKEN=${accessToken}\n`
      );

      res.send("✅ Token erhalten! Fenster kann geschlossen werden.");
      console.log("✅ .env erstellt! Starte Bot...");

      server.close();
      rl.close();

      // Bot starten
      const bot = spawn("node", ["./script.js"], { stdio: "inherit" });
      bot.on("close", (code) => console.log(`Bot beendet mit Code ${code}`));

    } catch (err) {
      console.error("Fehler beim Abrufen des Tokens:", err);
      res.send("Fehler beim Abrufen des Tokens");
    }
  });

  // Auth URL öffnen
  const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPES)}`;
  open(authUrl);

});

