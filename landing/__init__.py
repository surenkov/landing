from flask import Blueprint
from landing.models import Landing
from landing.api import landing_api
from landing.mail import landing_mail
from landing.utility.importlib import load_all_blocks

landing_app = Blueprint('landing', __name__)


def init_landing(app):
    import landing.views

    landing_api.init_app(app)
    landing_mail.init_app(app)
    app.register_blueprint(landing_app, url_prefix='/')


def init_blocks(app):
    load_all_blocks(app.config['BLOCKS_MODULE'])


def landing():
    landing_instance = Landing.objects.first()
    if landing_instance is None:
        landing_instance = Landing.objects.create(name='Landing')
    return landing_instance
