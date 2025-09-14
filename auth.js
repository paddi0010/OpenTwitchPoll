// auth.js
const express = require("express");
const open = require("open");
const readline = require("readline");
const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Twitch Developer App Daten
const CLIENT_ID = "ehqtbuxzo1wp7qx3c93kw89oo1vpr2"; // Trage deine Client ID hier ein
const CLIENT_SECRET = "3hkyylw1bkl4fxakew31c5abuiuty7"; // Trage dein Client Secret hier ein
const REDIRECT_URI = "http://localhost:3000/callback";
const SCOPES = ["chat:read", "chat:edit"].join(" ");

// Schritt 1: Usernamen abfragen
rl.question("Twitch Username: ", (username) => {

  const app = express();

  // Schritt 2: Server zum Empfangen des Codes starten
  const server = app.listen(3000, () => {
    console.log("Server läuft auf http://localhost:3000");
  });

  app.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send("Kein Code erhalten!");

    // Schritt 3: Code gegen Token tauschen
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

    // Schritt 4: Token in .env speichern
    const envContent = `TWITCH_USERNAME=${username}\nTWITCH_OAUTH_TOKEN=${accessToken}\n`;
    fs.writeFileSync(".env", envContent);

    res.send("Token erhalten! Du kannst das Fenster schließen.");

    console.log("✅ Token gespeichert in .env");
    server.close();
    rl.close();
  });

  // Schritt 5: Browser öffnen
  const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPES)}`;
  open(authUrl);
});
