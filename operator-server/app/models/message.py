from ..extensions import db
from datetime import datetime

class Message(db.Model):
    __tablename__ = "messages"

    id           = db.Column(db.Integer, primary_key=True)
    sender_id    = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    payload      = db.Column(db.Text, nullable=False)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            "id":         self.id,
            "sender":     self.sender_id,
            "payload":    json.loads(self.payload),
            "created_at": self.created_at.isoformat(),
        }