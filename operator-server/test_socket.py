import socketio
import requests

BASE_URL = "http://localhost:5050"

# Register two users
user_a = requests.post(f"{BASE_URL}/auth/register").json()
user_b = requests.post(f"{BASE_URL}/auth/register").json()

print(f"User A: {user_a['short_code']} | token: {user_a['token'][:8]}...")
print(f"User B: {user_b['short_code']} | token: {user_b['token'][:8]}...")

# Connect user B via WebSocket and listen for messages
sio_b = socketio.Client()

@sio_b.on("receive_message")
def on_message(data):
    print(f"\n✅ User B received message from {data['sender_short_code']}:")
    print(f"   payload: {data['payload']}")

@sio_b.on("connect")
def on_connect():
    print(f"\n✅ User B connected via WebSocket")

sio_b.connect(BASE_URL, auth={"token": user_b["token"]})

# Send a message from A to B via HTTP
response = requests.post(
    f"{BASE_URL}/messages/send",
    headers={"Authorization": f"Bearer {user_a['token']}"},
    json={
        "recipient_short_code": user_b["short_code"],
        "payload": {
            "ciphertext":      "dGVzdA==",
            "nonce":           "dGVzdA==",
            "message_counter": 1,
        }
    }
)
print(f"\n✅ Send status: {response.json()}")

# Wait briefly for the message to arrive then disconnect
import time
time.sleep(1)
sio_b.disconnect()