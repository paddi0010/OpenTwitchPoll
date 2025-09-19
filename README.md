
OpenTwitchPoll is a simple tool for Twitch streamers to create and manage live polls directly in chat – even for non-affiliate streamers.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
               [![Node.js Version](https://img.shields.io/badge/Node.js-%3E=18-brightgreen)](https://nodejs.org/)

OpenTwitchPoll is a simple tool for Twitch streamers to create and manage live polls directly in chat – even for non-affiliate streamers.

!This tool is under development therefore may contain bugs or unfinished features!

---

## ✨ Features

- 🎉 Live polls directly in the Twitch chat  
- 📝 Easy commands: `!poll start <poll>` & `!vote <vote>`  
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


## Port using
- Port **3001** used for Authentication

- Port **4000** used for Poll Overlay Server