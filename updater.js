const { execSync } = require("child_process");
const https = require("https");
const pkg = require("./package.json");

const REPO = "paddi0010/OpenTwitchPoll"; // dein GitHub Repo
const LOCAL_VERSION = pkg.version;

function getLatestRelease(callback) {
  https.get(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: { "User-Agent": "node.js" }
  }, (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => {
      try {
        const release = JSON.parse(data);
        const latest = release.tag_name.replace(/^v/, "");
        callback(latest);
      } catch (err) {
        console.error("❌ Fehler beim Lesen der Release-Daten:", err);
      }
    });
  }).on("error", (err) => {
    console.error("❌ API-Fehler:", err);
  });
}

getLatestRelease((latest) => {
  if (!latest) return;

  if (latest !== LOCAL_VERSION) {
    console.log(`🚀 Update verfügbar: ${latest} (aktuell: ${LOCAL_VERSION})`);
    try {
      execSync("git fetch --all", { stdio: "inherit" });
      execSync("git pull --rebase", { stdio: "inherit" }); // behält lokale Änderungen
      execSync("npm install", { stdio: "inherit" });
      console.log("✅ Update erfolgreich installiert! Lokale Änderungen wurden beibehalten.");
    } catch (err) {
      console.error("❌ Update fehlgeschlagen:", err);
    }
  } else {
    console.log("✅ Projekt ist aktuell.");
  }
});
