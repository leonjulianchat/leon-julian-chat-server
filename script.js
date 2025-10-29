// script.js
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  const body = document.body;

  // Prüfen, ob vorheriger Modus gespeichert war
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    body.classList.add(savedTheme);
    toggleBtn.textContent = savedTheme === "dark" ? "🌙" : "🌞";
  }

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    toggleBtn.textContent = isDark ? "🌙" : "🌞";

    // Speichern für nächsten Start
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});
