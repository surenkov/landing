from functools import wraps
from flask import session, g, redirect, url_for, abort
from landing import db
from landing.manager import manager


class User(db.Document):
    name = db.StringField()
    email = db.EmailField(unique=True, required=True)
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

    def is_authorized(self):
        return hasattr(g, 'user') \
            and isinstance(g.user, User) \
            and g.user.id == self.id

    def login(self):
        session['userid'] = self.id.binary
        g.user = self

    def logout(self):
        if not self.is_authorized(): return
        del session['userid']
        del g.user


def login_required(f):
    """ Use as authorized access decorator. """

    @wraps(f)
    def redirect_wrapper(*args, **kwargs):
        if not (is_authenticated() and g.user.is_authorized()):
            return redirect(url_for('manager.authorize'))
        return f(*args, **kwargs)

    return redirect_wrapper

def secure_api(f):
    """ Same as login_required, but instead of redirect on login page
        raises 403 error. """

    @wraps(f)
    def check_wrapper(*args, **kwargs):
        if not (is_authenticated() and g.user.is_authorized()):
            abort(403)
        return f(*args, **kwargs)

    return check_wrapper

def is_authenticated():
    user = g.get('user', None)
    return user is not None

@manager.before_request
def _authenticate_by_session():
    from bson import ObjectId
    user_id = session.get('userid')
    if user_id is not None:
        g.user = User.objects.filter(id=ObjectId(user_id)).first()

