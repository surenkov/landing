import os
from flask import Flask
from flask_mongoengine import MongoEngine, MongoEngineSessionInterface
from landing.blocks import load_blocks


app = Flask(__name__)
app.config.update(dict(
    MONGODB_SETTINGS = dict(
        db = 'test',
        host = '127.0.0.1',
    ),
    BLOCKS_DIR = os.path.join(os.path.dirname(__file__), 'blocks')
))

db = MongoEngine(app)
app.session_interface = MongoEngineSessionInterface(db)
load_blocks(app.config.get('BLOCKS_DIR'))

from landing.models import landing_factory
landing_page = landing_factory()

import landing.views
from landing.manager import manager
app.register_blueprint(manager)
