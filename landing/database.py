from flask_mongoengine import MongoEngine


def init_db(app):
    db = MongoEngine()
    app.config.setdefault('MONGODB_SETTINGS', {
        'db': 'landing',
        'host': '127.0.0.1'
    })
    db.init_app(app)
