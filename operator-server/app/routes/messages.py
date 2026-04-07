from flask import Blueprint, request, jsonify, g
from ..extensions import db, socketio
from ..models.message import Message
from ..models.user import User
from ..middleware.auth import require_auth
from flask_socketio import emit
import json

messages_bp = Blueprint("messages", __name__)


@messages_bp.route("/send", methods=["POST"])
@require_auth
def send_message():
    """
    If recepiant online, send directly via WebSocket
    Else store until recipient connects
    Expected JSON:
    {
        "recipient_short_code"
        "payload": {
            "ciphertext"
            "nonce"
            "ephemeral_public"
            "message_counter"
            "registration_id" (for libsignal)
        }
    }
    """
    data = request.get_json()
    if not data.get("recipient_short_code") or not data.get("payload"):
        return jsonify({"error": "Missing fields"}), 400

    recipient = User.query.filter_by(
        short_code=data["recipient_short_code"]
    ).first()
    if not recipient:
        return jsonify({"error": "Recipient not found"}), 404

    payload_str = json.dumps(data["payload"])

    # recipient online check
    recipient_sid = connected_users.get(recipient.id)
    if recipient_sid:
        socketio.emit("receive_message", {
            "sender_short_code": g.user.short_code,
            "payload":           data["payload"],
        }, to=recipient_sid)
        return jsonify({"status": "delivered"}), 200
    else:
        message = Message(
            sender_id=g.user.id,
            recipient_id=recipient.id,
            payload=payload_str,
        )
        db.session.add(message)
        db.session.commit()
        return jsonify({"status": "stored"}), 201

# run-time map of user_id to socket session id dict
connected_users = {}