from flask import Blueprint

manager_app = Blueprint('manager', __name__)


def init_manager(app):
    import manager.views
    app.register_blueprint(manager_app, url_prefix='/manager')
