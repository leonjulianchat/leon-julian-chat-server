// 🌟 LeonChat – MSN 2009 Aero Script 🌟
// Enthält Theme Switch, Datei-Upload und Nachrichtensystem

const body = document.body;
const themeSwitch = document.getElementById("themeSwitch");
const chatArea = document.querySelector(".chat-area");
const sendBtn = document.getElementById("sendBtn");
const msgInput = document.getElementById("msgInput");
const fileInput = document.getElementById("fileInput");
const attachBtn = document.getElementById("attachBtn");

let darkMode = false;
let username = "Leon"; // später evtl. dynamisch z. B. über Login setzen

// 💡 Theme Toggle
themeSwitch.addEventListener("click", () => {
  darkMode = !darkMode;
  body.classList.toggle("dark", darkMode);
  themeSwitch.textContent = darkMode ? "🌞" : "🌙";
});

// 💬 Nachricht senden
sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  addMessage("sent", username, text);
  playSendSound();

  // hier könnte später Fetch oder WebSocket folgen:
  // fetch("/send", {method: "POST", body: JSON.stringify({user: username, msg: text})});

  msgInput.value = "";
}

// 📎 Datei anhängen
attachBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const fileMsg = `<a href="#" class="file-link">📎 ${file.name}</a>`;
  addMessage("sent", username, fileMsg, true);
  playSendSound();
});

// 🧩 Nachricht anzeigen
function addMessage(type, user, content, isHTML = false) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${type}`;
  msgDiv.innerHTML = `
    ${type === "received" ? '<img src="https://i.imgur.com/Z9qK2yV.png" class="bubble-avatar">' : ""}
    <div class="bubble">${isHTML ? content : escapeHTML(content)}</div>
    ${type === "sent" ? '<img src="https://i.imgur.com/Z9qK2yV.png" class="bubble-avatar">' : ""}
  `;
  chatArea.appendChild(msgDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// 🔉 Soundeffekt beim Senden
function playSendSound() {
  const audio = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_347cfb29e6.mp3");
  audio.volume = 0.3;
  audio.play();
}

// 🔒 HTML Escape
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 🌐 Dummy-Begrüßung beim Start
window.addEventListener("load", () => {
  addMessage("received", "Server", "👋 Willkommen bei <b>LeonChat</b> – der MSN 2009 Neuauflage!");
  addMessage("received", "Server", "Du bist jetzt <b>online</b> 🟢");
});

