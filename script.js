alte script.js

const socket = io("https://leon-julian-chat-server.onrender.com");
let currentUser = null;

// Login
document.getElementById("login-btn").addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    if(!username || !password) return;

    socket.emit("login", {username, password});
});

socket.on("login_success", (data) => {
    currentUser = data.username;
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("chat-screen").classList.remove("hidden");
    updateContacts(data.contacts);
});

socket.on("login_error", (msg) => {
    document.getElementById("login-error").innerText = msg;
});

// Kontakte aktualisieren
function updateContacts(list) {
    const contactsUl = document.getElementById("contacts");
    contactsUl.innerHTML = "";
    list.forEach(user => {
        const li = document.createElement("li");
        li.innerText = user.username;
        li.className = user.online ? "online" : "offline";
        contactsUl.appendChild(li);
    });
}

// Nachrichten senden
document.getElementById("send-btn").addEventListener("click", () => {
    const msgInput = document.getElementById("message-input");
    const message = msgInput.value.trim();
    if(!message) return;
    socket.emit("send_message", {from: currentUser, message});
    msgInput.value = "";
});

// Nachrichten empfangen
socket.on("receive_message", (data) => {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message" + (data.from === currentUser ? " self" : "");
    msgDiv.innerText = `${data.from}: ${data.message}`;
    document.getElementById("messages").appendChild(msgDiv);
    msgDiv.scrollIntoView();
});
