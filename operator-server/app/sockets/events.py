from ..extensions import db, socketio
from ..models.message import Message
from ..models.user import User
from ..utils.token import hash_token
from ..routes.messages import connected_users
from flask_socketio import emit, disconnect
from flask import request


@socketio.on("connect")
def on_connect(auth):
    """
    register session and flush pending messages
    """
    token = auth.get("token") if auth else None
    if not token:
        disconnect()
        return

    user = User.query.filter_by(token_hash=hash_token(token)).first()
    if not user:
        disconnect()
        return

    # register socket session
    connected_users[user.id] = request.sid
    print(f"[socket] {user.short_code} connected (sid: {request.sid})")

    # flush pending messages
    pending = Message.query.filter_by(recipient_id=user.id)\
        .order_by(Message.created_at.asc()).all()

    for message in pending:
        sender = User.query.get(message.sender_id)
        emit("receive_message", {
            "sender_short_code": sender.short_code,
            "payload":           message.to_dict()["payload"],
        })
        db.session.delete(message)

    db.session.commit()


@socketio.on("disconnect")
def on_disconnect():
    """
    remove session and disconnect
    """
    user_id = next(
        (uid for uid, sid in connected_users.items() if sid == request.sid),
        None
    )
    if user_id:
        del connected_users[user_id]
        print(f"[socket] user {user_id} disconnected")