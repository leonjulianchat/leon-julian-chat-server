// script.js
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  const body = document.body;

  if (!toggleBtn) {
    console.error("❌ Kein Button mit ID 'theme-toggle-btn' gefunden!");
    return;
  } else {
    console.log("✅ Button gefunden:", toggleBtn);
  }

  // Vorherigen Modus laden
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    body.classList.add(savedTheme);
    toggleBtn.textContent = savedTheme === "dark" ? "🌙" : "🌞";
    console.log("🌈 Gespeicherter Modus geladen:", savedTheme);
  }

  // Klick-Event
  toggleBtn.addEventListener("click", () => {
    console.log("🖱️ Klick erkannt auf Theme-Toggle-Button");
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    toggleBtn.textContent = isDark ? "🌙" : "🌞";
    localStorage.setItem("theme", isDark ? "dark" : "light");
    console.log("🎨 Neuer Modus:", isDark ? "dark" : "light");
  });
});
