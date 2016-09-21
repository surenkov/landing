from flask import Blueprint
from landing.models import Landing
from landing.utility.importlib import load_all_blocks

landing_app = Blueprint('landing', __name__)


def init_landing(app):
    import landing.views
    load_all_blocks(app.config['blocks_dir'])
    app.register_blueprint(landing_app, url_prefix='/')


def landing():
    landing_instance = Landing.objects.first()
    if landing_instance is None:
        landing_instance = Landing.objects.create()
    return landing_instance
