from flask import render_template

from landing import landing
from manager import manager_app


@manager_app.route('/')
def manager_view():
    return render_template('manager.html', landing=landing())

