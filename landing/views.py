from functools import partial
from flask import render_template
from landing import landing_app, landing
from .utility.templates import render_blocks


@landing_app.route('/', endpoint='index')
def landing_view():
    landing_inst = landing()
    render = partial(render_blocks, landing=landing_inst)
    return render_template('landing.html',
                           landing=landing_inst,
                           blocks=landing_inst.blocks,
                           render=render)
