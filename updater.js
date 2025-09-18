const https = require("https");
const fs = require("fs");
const { execSync } = require("child_process");

const OWNER = "paddi0010";
const REPO = "OpenTwitchPoll";
const API_URL = `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`;
const VERSION_FILE = "version.txt";

function getLatestRelease() {
  return new Promise((resolve, reject) => {
    https.get(API_URL, { headers: { "User-Agent": "Updater" } }, (res) => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => resolve(JSON.parse(data)));
    }).on("error", reject);
  });
}

(async () => {
  try {
    const release = await getLatestRelease();
    const latestVersion = release.tag_name;
    console.log("Latest version:", latestVersion);

    let currentVersion = null;
    if (fs.existsSync(VERSION_FILE)) {
      currentVersion = fs.readFileSync(VERSION_FILE, "utf8").trim();
    }

    if (currentVersion === latestVersion) {
      console.log("✅ Already up to date.");
      return;
    }

    console.log("⬇️ Downloading update...");
    const asset = release.assets.find(a => a.name.endsWith(".zip"));
    if (!asset) throw new Error("No release asset found");

    const file = fs.createWriteStream("update.zip");
    https.get(asset.browser_download_url, (res) => {
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log("✅ Download complete. Extracting...");

        execSync("tar -xf update.zip", { stdio: "inherit" }); // oder unzip.exe
        fs.writeFileSync(VERSION_FILE, latestVersion);
        console.log("✅ Update applied.");
      });
    });
  } catch (err) {
    console.error("Update check failed:", err.message);
  }
})();
