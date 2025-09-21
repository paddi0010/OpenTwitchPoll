# OpenTwitchPoll
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E=18-brightgreen)](https://nodejs.org/)

This tool is under development therefore may contain bugs or unfinished features!

## 📋 Backlog

| Category | Feature / Improvement | Status | Priority | Notes |
|----------|---------------------|--------|---------|-------|
| Poll Management | Poll history / store past polls | Planned | Medium | Useful for stream recap |
| Poll Management | Poll timer (auto-close after X minutes) | Planned | High | Helps with timed polls |
| Poll Management | Limit votes per user | Planned | High | Prevent multiple votes per user |
| Commands | `!poll restart` / `!poll reopen` | Planned | Medium | Reopen a closed poll |
| Commands | Better error messages for invalid commands | Planned | High | e.g., `!vote 99`, `!poll Test?` without options |
| Overlay | Show closed poll indication | Planned | Medium | e.g., overlay text or fade effect |
| Overlay | Customizable layout / CSS per option | Planned | Low | Optional visual improvements |
| Bot / Backend | Persistent poll storage | Planned | High | Use JSON / DB to survive bot restarts |
| Bot / Backend | Logging & debugging improvements | Planned | Medium | Votes, errors, connections |
| Bot / Backend | Auto-update mechanism | Planned | Low | Check for new releases at start |
| User Experience | Extend `!help` command | Planned | Medium | Include all commands & usage |
| User Experience | Multi-language support | Planned | Low | Optional for international streams |


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
