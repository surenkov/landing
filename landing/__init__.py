from flask import Flask
from flask_mongoengine import MongoEngine


app = Flask(__name__)
db = MongoEngine(app)

import landing.blocks
import landing.views
from landing.manager import manager_app

app.register_blueprint(manager_app)
