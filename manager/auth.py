from functools import wraps
from flask import jsonify
from flask_restful import abort
from flask_jwt import (
    JWT,
    jwt_required,
    current_identity,
)
from landing.models import User

manager_jwt = JWT()
jwt_payload_callback = manager_jwt.jwt_payload_callback


@manager_jwt.authentication_handler
def authenticate(email, password):
    try:
        user = User.objects.get(email=email)
        if user.check_password(password):
            return user
    except User.DoesNotExist:
        pass
    return None


@manager_jwt.auth_response_handler
def login_response(access_token, identity):
    return jsonify({
        'token': access_token.decode('utf-8'),
        'name': identity.name,
        'email': identity.email,
        'role': identity.role
    })


@manager_jwt.identity_handler
def get_identity(payload):
    user_id = payload['identity']
    user = User.objects.filter(id=user_id).first()
    return user


@manager_jwt.jwt_payload_handler
def make_payload(identity):
    payload = jwt_payload_callback(identity)
    payload.update({'identity': str(identity.id)})
    return payload


def roles_allowed(*roles):

    def wrapper(view_func):
        @jwt_required()
        @wraps(view_func)
        def auth_handler(*args, **kwargs):
            if current_identity.role not in roles:
                abort(401)
            return view_func(*args, **kwargs)
        return auth_handler
    return wrapper


