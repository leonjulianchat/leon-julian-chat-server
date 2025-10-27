from flask import Flask, request
from flask_socketio import SocketIO, emit
from datetime import datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = "replace_this_with_random_string"
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

clients = {}

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")


@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=10000, allow_unsafe_werkzeug=True)


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
        emit("message", {"from": sender, "text": msg, "time": timestamp},
             room=clients[recipient])

@socketio.on("disconnect")
def handle_disconnect():
    for user, sid in list(clients.items()):
        if sid == request.sid:
            del clients[user]
            print(f"{user} disconnected")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=10000, allow_unsafe_werkzeug=True)

