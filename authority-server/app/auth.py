import os
import bcrypt
import jwt
import datetime
from .models.admin import Admin
from .extensions import db
from typing import Optional

def seed_admin():
    username = os.getenv("ADMIN_USERNAME", "authority")
    password = os.getenv("ADMIN_PASSWORD")

    existing = Admin.query.filter_by(username=username).first()
    if existing:
        return

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    admin = Admin(username=username, password_hash=hashed)
    db.session.add(admin)
    db.session.commit()

def generate_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=12),
    }
    return jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")


def verify_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        return payload["sub"]
    except Exception:
        return None