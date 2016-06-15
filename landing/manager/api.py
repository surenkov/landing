from flask import request, jsonify
from flask.views import MethodView
from landing.models import landing_factory
from landing.blocks import registered_blocks
from landing.manager import manager
from landing.manager.auth import secure_api


SUCCESS_RESULT = {'success': 1}
FAIL_RESULT = {'success': 0}

def register_api(view, endpoint, url, pk='id', pk_type='string'):
    view_func = secure_api(view.as_view(endpoint))
    url = '/api/%s/' % url.strip('/')
    manager.add_url_rule(url, defaults={pk: None},
                         view_func=view_func, methods=['GET'])
    manager.add_url_rule(url, view_func=view_func, methods=['POST'])
    manager.add_url_rule('%s<%s:%s>' % (url, pk_type, pk), view_func=view_func,
                     methods=['GET', 'PUT', 'DELETE'])
    return view


class BlockAPIView(MethodView):

    def __init__(self):
        self.landing = landing_factory()

    def get(self, id=None):
        if id is None:
            return jsonify(self.landing.blocks)
        return jsonify(self.landing.blocks.filter(id=id).first() or {})

    def post(self):
        cls = registered_blocks().get(request.form['_cls'], None)
        if cls is not None:
            block = cls()
            is_valid = block.submit_form(request.form, commit=False)
            if is_valid:
                self.landing.blocks.append(block)
                self.landing.save()
                return jsonify(SUCCESS_RESULT)
        return jsonify(FAIL_RESULT)

    def put(self, id):
        block = self.landing.blocks.filter(id=id).first()
        if block is not None and block.submit_form(request.form):
            return jsonify(SUCCESS_RESULT)
        return jsonify(FAIL_RESULT)

    def delete(self, id):
        block = self.landing.blocks.filter(id=id).first()
        if block is not None:
            self.landing.blocks.remove(block)
            return jsonify(SUCCESS_RESULT)
        return jsonify(FAIL_RESULT)

register_api(BlockAPIView, 'blocks_api', '/blocks/')

@manager.route('/api/blocks/all')
@secure_api
def all_available_blocks():
    blocks = [{
                'fields': list(b._fields.keys()), 
                '_cls': b._cls,
                'form': b.render_form()
              } for b in [cls() for cls in registered_blocks().values()]]
    return jsonify(blocks)
