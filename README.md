INSTALLATION
------------

```
(sudo) apt get install uwsgi
pip install -r requirements.txt
(sudo) npm install -g gulp-cli bower
npm install
bower install
```

DEPLOYMENT
----------

In files

-	`uwsgi.ini.template`
-	`server/rudoit/settings.py.template`

edit deployment parameters, remove `.template` from file names.

Collect static files & apply migrations:

```
npm build
python manage.py makemigrations
python manage.py migrate
```

### Development server:

`python manage.py runserver`

**Note: never use dev server in production!**

### Production server:

**TODO: configure Django to collect static files**

```
python manage.py collectstatic
```

Configure `uwsgi.ini`, then run `uwsgi uwsgi.ini`.

For additional info about uWSGI params, see [it's docs](https://uwsgi-docs.readthedocs.io/en/latest/WSGIquickstart.html).
