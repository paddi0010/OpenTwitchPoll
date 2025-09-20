console.log("Webseite für mein Tool läuft!");

// Beispiel: Button klick
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("Danke für dein Interesse!");
  });
});
