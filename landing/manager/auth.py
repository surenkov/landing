from flask import session, g, redirect, url_for
from landing import db
from landing.manager import manager


class User(db.Document):
    name = db.StringField()
    email = db.EmailField(unique=True)
    _hash = db.StringField()

    meta = {
        'indexes': ['email']
    }

    def set_password(self, password):
        from werkzeug import security
        self._hash = security.generate_password_hash(password)

    def check_password(self, password):
        from werkzeug import security
        return security.check_password_hash(self._hash, password)

    def is_authorized():
        return hasattr(g, 'user') \
            and isinstance(g.user, User) \
            and g.user.id == self.id

    def login(self):
        session['userid'] = user.id
        g.user = self

    def logout(self):
        if not self.is_authorized(): return
        del session['userid']
        del g.user


def login_required(f):
    """ Use as authorized access decorator. """
    from functools import wraps

    @wraps(f)
    def redirect_wrapper(*args, **kwargs):
        if not (is_authenticated() and g.user.is_authorized()):
            return redirect(url_for('manager.authorize'))
        return f(*args, **kwargs)

    return redirect_wrapper

def is_authenticated():
    user = g.get('user', None)
    return user is not None

@manager.before_request
def _authenticate_by_session():
    if session.get('userid') is not None:
        g.user = User.objects.get(id=session['userid'])

