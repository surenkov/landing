INSTALLATION
------------

1. Install Python 3.3+, Node
2. Create Python virtual env
3. From env's source run:
```
pip install -r requirements.txt
(sudo) npm install -g gulp-cli bower
bower install
npm install
gulp
```

DEPLOYMENT
----------

### Development server:

`flask run runserver.py`

**Note: never use dev server in production!**

### Production server:

**TODO**

For additional info about uWSGI params, see [it's docs](https://uwsgi-docs.readthedocs.io/en/latest/WSGIquickstart.html).
