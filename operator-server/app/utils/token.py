import os
import hashlib
import random
from .wordlist import ADJECTIVES, NOUNS
from ..extensions import db


def generate_token() -> str:
    return os.urandom(32).hex()


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def generate_short_code() -> str:
    adjective = random.choice(ADJECTIVES)
    noun = random.choice(NOUNS)
    digits = str(random.randint(1000, 9999))
    return f"{adjective}-{noun}-{digits}"



def generate_unique_short_code() -> str:
    from ..models.user import User
    while True:
        code = generate_short_code()
        if not User.query.filter_by(short_code=code).first():
            return code