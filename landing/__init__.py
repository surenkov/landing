import os
from flask import Flask
from flask_mongoengine import MongoEngine
from flask_mail import Mail
from landing.blocks import load_blocks


app = Flask(__name__, static_folder='../static', static_url_path='/static')
app.config.update(dict(
    MONGODB_SETTINGS=dict(
        db='test',
        host='127.0.0.1',
    ),
    BLOCKS_DIR=os.path.join(os.path.dirname(__file__), 'blocks'),
    MEDIA_ROOT=os.path.join(app.static_folder, 'media'),
    MEDIA_URL=app.static_url_path + '/media/',
    MAX_CONTENT_LENGTH=16 * 1024 * 1024,
    SECRET_KEY='Development key'  # Check if key is overridden in prod environ
))

db = MongoEngine(app)
mail = Mail(app)
load_blocks(app.config.get('BLOCKS_DIR'), app.jinja_loader)

import landing.models
import landing.views

from landing.manager import manager
app.register_blueprint(manager)
