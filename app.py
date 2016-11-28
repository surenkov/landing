from os import environ
from flask import Flask

from manager import init_manager
from landing import init_landing, init_blocks
from landing.database import init_db

app = Flask(__name__)
app.config.update(ENV=environ.get('FLASK_ENV', 'production'))
app.config.from_json('config/landing.json')

init_db(app)
init_blocks(app)
init_landing(app)
init_manager(app)

if __name__ == '__main__':
    app.run('localhost', 9090, debug=True)
