from os import environ
from flask import Flask

from manager import init_manager
from landing import init_landing
from landing.database import init_db

app = Flask(__name__)
app.config.setdefault('blocks_dir', 'blocks/')
app.config.setdefault('env', environ.get('FLASK_ENV', 'production'))

init_db(app)
init_landing(app)
init_manager(app)

if __name__ == '__main__':
    app.run('localhost', 9090, debug=False)
