// === LeonChat – MSN 2009 Style ===

// SOCKET.IO CONNECTION
const socket = io("https://leon-julian-chat-server.onrender.com"); // dein Render-Server

// === ELEMENTE HOLEN ===
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatBox = document.getElementById("chatBox");
const themeSwitch = document.getElementById("themeSwitch");
const fileInput = document.getElementById("fileInput");
const onlineDot = document.getElementById("statusDot");

// === SOUND ===
const msnSound = new Audio("https://win98icons.alexmeub.com/sounds/MSN_Receive.mp3");

// === THEME SWITCH ===
themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark", themeSwitch.checked);
  localStorage.setItem("theme", themeSwitch.checked ? "dark" : "light");
});

// Theme beim Laden merken
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeSwitch.checked = true;
}

// === MESSAGE SENDEN ===
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const msg = messageInput.value.trim();
  if (msg !== "") {
    socket.emit("message", msg);
    appendMessage("self", msg);
    messageInput.value = "";
  }
}

// === DATEI-UPLOAD ===
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    appendMessage("self", `📎 <i>${file.name}</i> wurde angehängt`);
  }
});

// === EMPFANGENE NACHRICHTEN ===
socket.on("message", (msg) => {
  appendMessage("other", msg);
  msnSound.currentTime = 0;
  msnSound.play().catch(() => {});
});

// === NACHRICHT IN CHAT-FENSTER ANZEIGEN ===
function appendMessage(type, text) {
  const msgEl = document.createElement("div");
  msgEl.classList.add("message", type);
  msgEl.innerHTML = text;
  chatBox.appendChild(msgEl);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// === ONLINE-STATUS ===
socket.on("connect", () => {
  onlineDot.classList.add("online");
});

socket.on("disconnect", () => {
  onlineDot.classList.remove("online");
});
