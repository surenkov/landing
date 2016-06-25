from flask import render_template
from landing import app
from landing.models import landing_factory
from landing.blocks import registered_blocks


@app.route('/')
def home():
    return render_template('index.html', landing=landing_factory(),           
                           all_blocks=registered_blocks().values())