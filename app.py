from flask import Flask, request, render_template, redirect, session, send_from_directory
from flask_socketio import SocketIO, emit
from datetime import datetime
import sqlite3
import os

# -----------------------------------
# Grund-App + SocketIO
# -----------------------------------
app = Flask(__name__)
app.config["SECRET_KEY"] = "super_secret_key_123"

socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

clients = {}

DB_PATH = "users.db"


# -----------------------------------
#  Datenbank automatisch erzeugen
# -----------------------------------
def init_db():
    if not os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
            )
        """)
        cur.execute("INSERT INTO users (username, password) VALUES (?, ?)", ("leon", "1234"))
        conn.commit()
        conn.close()
        print("Datenbank erstellt: Benutzer leon/1234")


# -----------------------------------
#  LOGIN
# -----------------------------------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        name = request.form["username"]
        pw = request.form["password"]

        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE username=? AND password=?", (name, pw))
        user = cur.fetchone()
        conn.close()

        if user:
            session["user"] = name
            return redirect("/")
        else:
            return "❌ Benutzername oder Passwort falsch"

    return render_template("login.html")


# -----------------------------------
#  LOGOUT
# -----------------------------------
@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect("/login")


# -----------------------------------
#  Hauptseite (Chat)
# -----------------------------------
@app.route("/")
def index():
    if "user" not in session:
        return redirect("/login")
    return render_template("index.html")


# -----------------------------------
#  Static Folder Fix
# -----------------------------------
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)


# -----------------------------------
#  SOCKET.IO EVENTS
# -----------------------------------
@socketio.on("connect")
def handle_connect():
    print("Client connected")


@socketio.on("register")
def register_user(data):
    username = data.get("username")
    if username:
        clients[username] = request.sid
        print(f"{username} registered")


@socketio.on("message")
def handle_message(data):
    sender = data.get("from")
    recipient = data.get("to")
    msg = data.get("text")
    timestamp = datetime.now().strftime("%H:%M:%S")

    print(f"{timestamp} {sender} → {recipient}: {msg}")

    if recipient in clients:
        emit("message", {
            "from": sender,
            "text": msg,
            "time": timestamp
        }, room=clients[recipient])


@socketio.on("disconnect")
def handle_disconnect():
    for user, sid in list(clients.items()):
        if sid == request.sid:
            del clients[user]
            print(f"{user} disconnected")


# -----------------------------------
#  START
# -----------------------------------
if __name__ == "__main__":
    init_db()
    socketio.run(app, host="0.0.0.0", port=10000, allow_unsafe_werkzeug=True)
