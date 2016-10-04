from os import environ, getcwd, path
from flask import Flask

from manager import init_manager
from landing import init_landing, init_blocks
from landing.database import init_db

app = Flask(__name__)
app.config.update({
    'blocks_module': 'blocks',
    'env': environ.get('FLASK_ENV', 'production'),
    'MEDIA_ROOT': path.join(getcwd(), 'static/media/')
})

init_db(app)
init_landing(app)
init_manager(app)
init_blocks(app)

if __name__ == '__main__':
    app.run('localhost', 9090, debug=True)
