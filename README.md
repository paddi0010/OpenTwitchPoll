# OpenTwitchPoll
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E=18-brightgreen)](https://nodejs.org/)

This tool is under development therefore may contain bugs or unfinished features!

# 🗂 Backlog

| Category       | Feature / Task | Priority | Status | Description |
|----------------|----------------|----------|--------|-------------|
| Feature ✨      | Overlay: highlight leading option in green | High | Open | Highlight the option with the most votes like on Twitch |
| Feature ✨      | Overlay: bar chart for vote distribution | Medium | Open | Optional: visual bars showing vote counts per option |
| Feature ✨      | Automatic timer for polls without time | High | Open | Default 60s if no time is provided |
| Feature ✨      | Expand !help command | Medium | Open | Separate admin vs user commands + explain timer usage |
| Bugfix 🐛       | Fix timer edge cases | High | Open | Handle polls with special characters or extra spaces |
| Bugfix 🐛       | Update overlay when poll is closed/cleared | High | Open | Overlay should immediately show "Closed" or clear content |
| Bugfix 🐛       | Reset votes for consecutive polls | Medium | Open | Old votes should not carry over |
| Bugfix 🐛       | Bot stability on network disconnect / server crash | High | Open | Prevent crashes when Twitch or server disconnects |
| Improvement ⚙ | Refactor script.js | Medium | Open | Make timer parsing more robust and improve structure |
| Improvement ⚙ | Refactor pollCommand.js | Medium | Open | Separate parsing of question/options from poll creation |
| Improvement ⚙ | Optimize overlay.js | Medium | Open | Only update DOM when changes occur; clean code |
| Improvement ⚙ | Improve logging | Low | Open | Show debug logs only in debug mode |
| Idea 💡        | Poll history storage | Low | Open | Store last 5 polls for later reference |
| Idea 💡        | Bot announces winning option after poll | Medium | Open | Display "Winning option is …" in chat |
| Idea 💡        | Countdown animation in overlay | Medium | Open | Animated bar or pulse for last 5 seconds |
| Idea 💡        | Multi-language support | Low | Open | Toggle between English and German in chat and overlay |



---

## ✨ Features

- 🎉 Live polls directly in the Twitch chat
- ✍️ Commands are available [here](https://github.com/paddi0010/OpenTwitchPoll/wiki/Commands)
- 🖼 Overlay support via Socket.IO  
- 🚫 No affiliate status required  
- ⚡ Startup via `.bat` or Node.js  

---

## ⚙️ Requirements

- [Node.js 18+](https://nodejs.org/)  
- A Twitch account  
- A registered application on the [Twitch Developer Console](https://dev.twitch.tv/console) 

---

## 📦 Installation

1. Download the latest **.zip** from the [Releases](../../releases) page and extract it.  

2. Open the file **`start_env`** and insert your **`CLIENT_ID`** and **`CLIENT_SECRET`** (without spaces).  
   You can get these from the [Twitch Developer Console](https://dev.twitch.tv/console):  
   - Log in with your Twitch account  
   - Click **"Register Your Application"**  
   - Give your application a name  
   - Enter the following under **OAuth Redirect URLs**:  
     ```
     http://localhost:3001/callback
     ```  
   - Choose **Other** as the category  
   - After saving, you will see your **Client ID**  
   - Create a **New Secret** → this is your **Client Secret**  
   - Copy both values into the `start_env` file  

3. Start the bot with **`start.bat`**  
   - On the first run, dependencies will be installed automatically  
   - After that, you will be prompted to enter your Twitch username  

---

## 🌐 Port Usage

- Port **3001** → Authentication  
- Port **4000** → Poll Overlay Server  
