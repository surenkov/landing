from flask import request, jsonify
from flask.views import MethodView
from wtforms import FormField, HiddenField
from werkzeug.datastructures import CombinedMultiDict, ImmutableMultiDict
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
                         view_func=view_func,
                         methods=['GET', 'POST'])
    manager.add_url_rule('%s<%s:%s>' % (url, pk_type, pk), 
                         view_func=view_func,
                         methods=['GET', 'POST', 'PUT', 'DELETE'])

def block_to_dict(block):
    bdict = dict(block._data)
    bdict['id'] = str(block.id)
    return bdict

def combined_request_data():
    return CombinedMultiDict([request.form, request.files, 
                              ImmutableMultiDict(request.json)])


class BlockAPIView(MethodView):

    def __init__(self):
        self.landing = landing_factory()

    def get(self, id=None):
        if id is None:
            blocks = [block_to_dict(b) for b in self.landing.blocks]
            return jsonify(blocks)
        return jsonify(
            block_to_dict(self.landing.blocks.filter(id=id).first()) or {})

    def post(self, id=None):
        if id is not None:
            return self.put(id)
        request_data = combined_request_data()
        cls = registered_blocks().get(request_data['_cls'], None)
        if cls is not None:
            block = cls()
            is_valid = block.submit_form(request_data, commit=False)
            if is_valid:
                self.landing.blocks.append(block)
                self.landing.save()
                result = dict(SUCCESS_RESULT)
                result.update(block_to_dict(block))
                return jsonify(result)
        return jsonify(FAIL_RESULT)

    def put(self, id):
        block = self.landing.blocks.filter(id=id).first()
        if block is not None \
                and block.submit_form(combined_request_data()):
            self.landing.save()
            result = dict(SUCCESS_RESULT)
            result.update(block_to_dict(block))
            return jsonify(result)
        return jsonify(FAIL_RESULT)

    def delete(self, id):
        block = self.landing.blocks.filter(id=id).first()
        if block is not None:
            self.landing.blocks.remove(block)
            self.landing.save()
            return jsonify(SUCCESS_RESULT)
        return jsonify(FAIL_RESULT)

register_api(BlockAPIView, 'blocks_api', '/blocks/')

@manager.route('/api/blocks/all')
@secure_api
def all_available_blocks():
    instances =[cls() for cls in registered_blocks().values()] 
    blocks = {b._cls: {
                'fields': _collect_fields_from_form(b._form()),
                'form': b.render_form(),
                'name': b._block_meta['verbose_name']
            } for b in instances }
    return jsonify(blocks)

def _collect_fields_from_form(form):
    fields = []
    for field in form:
        if isinstance(field, HiddenField):
            continue
        elif isinstance(field, FormField):
            fields.extend(_collect_fields_from_form(field.form))
        else:
            fields.append(field.name)
    return fields

            
