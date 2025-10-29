const socket = io("https://leon-julian-chat-server.onrender.com");
const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");
const themeToggleBtn = document.getElementById("theme-toggle-btn");

// Dark/Light Mode speichern und laden
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggleBtn.textContent = "🌙";
  }
});

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggleBtn.textContent = isDark ? "🌙" : "🌞";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Verbindung
socket.on("connect", () => {
  const msg = document.createElement("div");
  msg.classList.add("system");
  msg.textContent = "🟢 Verbunden mit LeonChat-Server.";
  messages.appendChild(msg);
});

// Nachricht empfangen
socket.on("message", (data) => {
  const msg = document.createElement("div");
  msg.classList.add("message");
  msg.innerHTML = `<strong>${data.user}:</strong> ${data.msg}`;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
});

// Nachricht senden
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim() !== "") {
    socket.emit("message", { user: "Du", msg: input.value });
    input.value = "";
  }
});
