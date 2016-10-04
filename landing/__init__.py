from flask import Blueprint
from landing.models import Landing
from landing.utility.importlib import load_all_blocks

landing_app = Blueprint('landing', __name__)


def init_landing(app):
    import landing.views
    app.register_blueprint(landing_app, url_prefix='/')


def init_blocks(app):
    load_all_blocks(app.config['blocks_module'])


def landing():
    landing_instance = Landing.objects.first()
    if landing_instance is None:
        landing_instance = Landing.objects.create(name='Landing')
    return landing_instance
