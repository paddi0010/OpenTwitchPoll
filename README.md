# OpenTwitchPoll

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E=18-brightgreen)](https://nodejs.org/)

OpenTwitchPoll ist ein einfaches Tool für Twitch-Streamer, um Live-Umfragen direkt im Chat zu erstellen und auszuwerten – auch für Non-Affiliate-Streamer.

---

## Features

- Live-Polls direkt im Twitch-Chat
- Einfache Start- und Voting-Kommandos (`!poll`, `!vote`)
- Overlay-Unterstützung via Socket.IO
- Kein Affiliate-Status nötig
- Benutzerfreundlicher Start via `.bat` oder Node.js

---

## Installation

1. Lade über die Releases die .zip und entpacke diese.
2. öffne die `start_env` Datei und trage `CLIENT_ID` und `CLIENT_SECRET` hinter den "=" OHNE LEERZEICHEN ein, diese bekommst du auf (dev.twitch.tv), dort klickst du oben rechts auf Login with Twitch und danach auf Your Console. Klicke dann auf Deine Anwendung registrieren und gebe dieser einen Namen. Als OAUTH Redirect URLS `http://localhost:3000/callback` ein, bei der Kategorie other. Du siehst weiter unten die Client-ID und daunter den Button Neues Geheimnis, diesen klickst du an und danach auf speichern. Füge nun die die Client-ID und den Client Secret in die `start_env` datei ein.
3. Klicke auf die `start.bat` und gebe deinen Namen nach der Installation der abhängigkeiten ein.
