from werkzeug import security
from landing import db


class User(db.Document):
    user_name = db.StringField()
    email = db.EmailField()
    _hash = db.StringField()

    meta = {
        'indexes': ['user_name', 'email']
    }

    def set_password(self, password):
        self._hash = security.generate_password_hash(password)

    def check_password(self, password):
        return security.check_password_hash(self._hash, password)
