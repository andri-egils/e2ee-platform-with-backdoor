from app import create_app
from app.extensions import socketio
import os

app = create_app()

if __name__ == "__main__":
    socketio.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5050)),
        debug=os.getenv("FLASK_DEBUG", "true").lower() == "true"
    )