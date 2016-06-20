from flask import render_template
from landing import app
from landing.models import landing_factory


@app.route('/')
def home():
    return render_template('index.html', landing=landing_factory())