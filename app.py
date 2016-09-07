from flask import Flask
from shared.database import init_db

app = Flask(__name__)
init_db(app)
