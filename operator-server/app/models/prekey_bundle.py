from ..extensions import db
from datetime import datetime

class IdentityKey(db.Model):
    __tablename__ = "identity_keys"

    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    ik_public  = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class SignedPrekey(db.Model):
    __tablename__ = "signed_prekeys"

    id            = db.Column(db.Integer, primary_key=True)
    user_id       = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    spk_id        = db.Column(db.Integer, nullable=False)
    spk_public    = db.Column(db.Text, nullable=False)
    spk_signature = db.Column(db.Text, nullable=False)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)


class OneTimePrekey(db.Model):
    __tablename__ = "one_time_prekeys"

    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    opk_id     = db.Column(db.Integer, nullable=False)
    opk_public = db.Column(db.Text, nullable=False)
    used       = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)