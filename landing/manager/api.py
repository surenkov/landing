from flask import request, jsonify, abort
from flask.views import MethodView
from flask_wtf import Form
from wtforms import FormField, HiddenField, StringField
from werkzeug.datastructures import CombinedMultiDict, ImmutableMultiDict
from landing.models import landing_factory
from landing.mediastorage import MediaStorage, MediaFile
from landing.blocks import registered_blocks
from landing.manager import manager
from landing.manager.auth import secure_api


def register_crud_api(endpoint, url, pk='id', pk_type='string'):
    """ Registers MethodView subclass as full CRUD implementation. """

    def register_decorator(view):
        view_func = secure_api(view.as_view(endpoint))
        url_ = '/api/%s/' % url.strip('/')
        manager.add_url_rule(url_, defaults={pk: None},
                             view_func=view_func,
                             methods=['GET', 'POST'])
        manager.add_url_rule('%s<%s:%s>' % (url_, pk_type, pk),
                             view_func=view_func,
                             methods=['GET', 'POST', 'PUT', 'DELETE'])
        return view

    return register_decorator


def register_get_post_api(endpoint, url):
    """ Registers MethodView subclass as get/post processor. """

    def register_decorator(view):
        url_ = '/api/%s/' % url.strip('/')
        manager.add_url_rule(url_,
                             view_func=secure_api(view.as_view(endpoint)),
                             methods=['GET', 'POST'])
        return view

    return register_decorator


def document_to_dict(block):
    bdict = dict(block._data)
    bdict['id'] = str(block.id)
    return bdict


def combined_request_data():
    return CombinedMultiDict([request.form, ImmutableMultiDict(request.json)])


class LandingForm(Form):
    title = StringField('Заголовок', description='Заголовок окна браузера')
    owner = StringField('Владелец', description='Показывается в футере')


@register_get_post_api('landing_api', '/landing/')
class LandingAPIView(MethodView):

    def __init__(self):
        self.landing = landing_factory()

    def get(self):
        return jsonify({
            'title': self.landing.title,
            'owner': self.landing.owner
        } if self.landing is not None else {})

    def post(self):
        form = LandingForm()
        if form.validate_on_submit():
            form.populate_obj(self.landing)
            self.landing.save()
            return self.get()
        return jsonify({}), 400


@register_crud_api('blocks_api', '/blocks/')
class BlockAPIView(MethodView):

    def __init__(self):
        self.landing = landing_factory()

    def get(self, id=None):
        if id is None:
            blocks = [document_to_dict(b) for b in self.landing.blocks]
            return jsonify(blocks)
        return jsonify(
            document_to_dict(self.landing.blocks.filter(id=id).first()) or {})

    def post(self, id=None):
        if id is not None:
            return self.put(id)
        request_data = combined_request_data()
        cls = registered_blocks().get(request_data['_cls'], None)
        if cls is not None:
            block = cls()
            is_valid, errors = block.submit_form(request_data, commit=False)
            if is_valid:
                self.landing.blocks.append(block)
                self.landing.save()
                return jsonify(document_to_dict(block))
            else:
                return jsonify(errors), 400
        return jsonify({}), 404

    def put(self, id):
        block = self.landing.blocks.filter(id=id).first()
        if block is None:
            return jsonify({}), 404
        is_valid, errors = block.submit_form(combined_request_data())
        if is_valid:
            self.landing.save()
            return jsonify(document_to_dict(block))
        else:
            return jsonify(errors), 400

    def delete(self, id):
        block = self.landing.blocks.filter(id=id).first()
        if block is not None:
            self.landing.blocks.remove(block)
            self.landing.save()
            return jsonify({})
        return jsonify({}), 404


def prepare_file_model(model):
    serialized_model = document_to_dict(model)
    del serialized_model['path']
    return serialized_model


@register_crud_api('media', '/media/')
class MediaAPIView(MethodView):

    def __init__(self):
        self.media_storage = MediaStorage()

    def get(self, id=None):
        if id is None:
            return jsonify([prepare_file_model(f) 
                            for f in self.media_storage.list()])
        try:
            return jsonify(prepare_file_model(self.media_storage.get(id)))
        except:
            return jsonify({}), 404

    def post(self, id=None):
        if id is not None:
            abort(400)
        try:
            file = request.files['file']
            return jsonify(prepare_file_model(self.media_storage.save(file)))
        except TypeError as e:
            return jsonify(e.args), 400
        except KeyError:
            abort(400)

    def put(self, id):
        abort(400)

    def delete(self, id):
        try:
            file = self.media_storage.get(id)
            file.delete()
            return '', 200
        except MediaFile.DoesNotExist:
            abort(404)


@manager.route('/api/blocks/all')
@secure_api
def all_available_blocks():
    instances =[cls() for cls in registered_blocks().values()]
    blocks = {b._cls: {
        'fields': _collect_fields_from_form(b._form()),
        'form': b.render_form(),
        'name': b._block_meta['verbose_name']
    } for b in instances}
    return jsonify(blocks)


def _collect_fields_from_form(form):

    def _collect_fields_from_form_internal(form_):
        fields_ = []
        for field in form_:
            if isinstance(field, HiddenField):
                continue
            elif isinstance(field, FormField):
                fields_.extend(_collect_fields_from_form(field.form))
            else:
                fields_.append(field.name)
        return fields_

    fields = _collect_fields_from_form_internal(form)
    fields.extend(['_cls', 'id'])
    return fields
