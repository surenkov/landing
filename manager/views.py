from flask import render_template
from manager import manager_app


@manager_app.route('/')
def manager_view():
    return render_template('manager.html')
