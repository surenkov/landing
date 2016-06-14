import os
from flask import Flask
from flask_mongoengine import MongoEngine, MongoEngineSessionInterface
from flask_wtf import CsrfProtect
from landing.blocks import load_blocks


app = Flask(__name__, static_folder='../dist', static_url_path='/static')
app.config.update(dict(
    MONGODB_SETTINGS = dict(
        db = 'test',
        host = '127.0.0.1',
    ),
    BLOCKS_DIR = os.path.join(os.path.dirname(__file__), 'blocks'),
    SECRET_KEY = 'Development key'  # Check if key is overridden in prod environ
))

csrf = CsrfProtect(app)
db = MongoEngine(app)
load_blocks(app.config.get('BLOCKS_DIR'))

from landing.models import landing_factory
landing_page = landing_factory()

import landing.views
from landing.manager import manager
app.register_blueprint(manager)
