from datetime import timedelta
from flask import Blueprint
from manager.api import manager_api
from manager.auth import manager_jwt

manager_app = Blueprint('manager', __name__)

CONFIG = {
    'JWT_AUTH_URL_RULE': '/manager/api/auth',
    'JWT_AUTH_USERNAME_KEY': 'email',
    'JWT_EXPIRATION_DELTA': timedelta(days=30),
    'JWT_SECRET_KEY': b'\x8c\x9bT\xb7D\xb2E\xe4\xe9RsL\x07?\xd5\x80+\xfc\x17'
                      b'\xfa\xdd\xe8\x02\xfdg\xb6?\\\xacD'
}


def init_manager(app):
    import manager.views

    app.config.update(CONFIG)
    app.register_blueprint(manager_app, url_prefix='/manager')
    manager_api.init_app(app)
    manager_jwt.init_app(app)
