from flask import render_template
from landing import landing_app


@landing_app.route('/')
def landing_view():
    return render_template('landing.html')
