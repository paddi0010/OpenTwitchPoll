const fetch = require("node-fetch");
const { execSync } = require("child_process");
const readline = require("readline");

const repo = "paddi0010/OpenTwitchPoll";

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans.trim());
  }));
}

(async () => {
  try {

    const resp = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
    const data = await resp.json();

    if (!data.tag_name) {
      console.log("⚠️ Konnte keine Release-Infos abrufen.");
      return;
    }

    const remoteVersion = data.tag_name.replace(/^v/, "");
    const localPkg = require("./package.json");
    const localVersion = localPkg.version;

    console.log(`📦 Lokale Version: ${localVersion}`);
    console.log(`🌐 Neueste Version: ${remoteVersion}`);

    if (localVersion !== remoteVersion) {
      const answer = await askQuestion("🚀 Update verfügbar! Soll geupdatet werden? (y/n) ");

      if (answer.toLowerCase() === "y") {
        console.log("⬇️ Update wird ausgeführt...");
        execSync("git fetch --all", { stdio: "inherit" });
        execSync("git reset --hard origin/main", { stdio: "inherit" });
        execSync("npm install", { stdio: "inherit" });
        console.log("✅ Update abgeschlossen!");
      } else {
        console.log("⏩ Update übersprungen.");
      }
    } else {
      console.log("ℹ️ Kein Update verfügbar. Du bist auf dem neuesten Stand ✅");
    }

  } catch (err) {
    console.error("❌ Fehler beim Updater:", err.message);
  }
})();
