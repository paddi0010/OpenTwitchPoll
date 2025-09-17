# OpenTwitchPoll

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E=18-brightgreen)](https://nodejs.org/)

OpenTwitchPoll ist ein einfaches Tool für Twitch-Streamer, um Live-Umfragen direkt im Chat zu erstellen und auszuwerten – auch für Non-Affiliate-Streamer.

---

## ✨ Features

- 🎉 Live-Polls direkt im Twitch-Chat  
- 📝 Einfache Befehle: `!poll` & `!vote`  
- 🖼 Overlay-Unterstützung via Socket.IO  
- 🚫 Kein Affiliate-Status nötig  
- ⚡ Benutzerfreundlicher Start via `.bat` oder Node.js  

---

## 📦 Installation

1. Lade die neueste **.zip** über die [Releases](../../releases) herunter und entpacke sie.  

2. Öffne die Datei **`start_env`** und trage deine **`CLIENT_ID`** und **`CLIENT_SECRET`** (ohne Leerzeichen) ein.  
   Diese erhältst du auf [Twitch Developer Console](https://dev.twitch.tv/console):  
   - Melde dich mit deinem Twitch-Account an  
   - Klicke auf **„Deine Anwendungen registrieren“**  
   - Vergib einen Namen  
   - Trage bei **OAuth Redirect URLs** folgendes ein:  
     ```
     http://localhost:3000/callback
     ```  
   - Wähle als Kategorie **Other**  
   - Nach dem Speichern findest du die **Client-ID**  
   - Erstelle darunter ein **Neues Geheimnis** → das ist dein **Client-Secret**  
   - Beide Werte kopierst du in deine `start_env` Datei  

3. Starte den Bot mit **`start.bat`**  
   - Beim ersten Start werden automatisch die Abhängigkeiten installiert  
   - Danach wirst du aufgefordert, deinen Twitch-Namen einzugeben  

---

## 🚀 Nutzung

- **Poll starten:**
