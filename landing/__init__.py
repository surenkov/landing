from flask import Flask
from flask_mongoengine import MongoEngine, MongoEngineSessionInterface


app = Flask(__name__)
db = MongoEngine(app)
app.session_interface = MongoEngineSessionInterface(db)

import landing.blocks
import landing.models
import landing.views

from landing.manager import manager_app
app.register_blueprint(manager_app)
