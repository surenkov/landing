INSTALLATION
------------

### Manual install
1. Install Python 3.5+, Node, MongoDB.
2. Create Python virtualenv.
3. From env's source, run:
```
pip install -r requirements.txt
npm install -g gulp-cli bower
bower install
npm install
```

DEPLOYMENT
----------

### Development server:

On installed environment, run:

`python3 runserver.py`

**Note: never use dev server in production!**

### Production server:

1. Create user `landing` with `/home/landing` home folder and `sudo` privileges.
2. Clone this repo into `~/app` folder.
3. Run `sudo bash deploy.sh`.
4. Update app config.
5. ...
6. PROFIT!
