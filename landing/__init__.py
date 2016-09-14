from landing.models import Landing
from .importlib import load_all_blocks


def init_landing(app):
    load_all_blocks(app.config['blocks_dir'])


def landing():
    landing_instance = Landing.objects.first()
    if landing_instance is None:
        landing_instance = Landing.objects.create()
    return landing_instance

