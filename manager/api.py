from flask import request, current_app
from flask_restful import Api, Resource, marshal_with, marshal, abort
from mongoengine.base import get_document

from landing import landing, models
from landing.utility.templates import get_template_list
from landing.utility.blocks import (
    get_parser, get_serializer, registered_blocks
)

from .auth import jwt_required, roles_allowed
from .utility.fields import (
    landing_fields, block_fields, media_fields, user_fields
)
from .utility.parsers import (
    landing_parser, block_parser, media_parser, user_parser
)

manager_api = Api(prefix='/manager/api')


class AuthResource(Resource):
    method_decorators = [jwt_required()]


class AdminResource(Resource):
    method_decorators = [jwt_required(), roles_allowed('admin')]


@manager_api.resource('/landing')
class Landing(AuthResource):

    @marshal_with(landing_fields)
    def get(self):
        return landing()

    @marshal_with(landing_fields)
    def put(self):
        data = landing_parser.parse_args()
        landing_inst = landing()
        landing_inst.modify(**data)
        return landing_inst


@manager_api.resource('/landing/config')
class Config(AdminResource):

    def get(self):
        return landing().config

    def put(self):
        data = request.get_json()
        landing_inst = landing()
        landing_inst.modify(config=data)
        return landing_inst.config


@manager_api.resource('/blocks')
class BlockList(AuthResource):

    def get(self):
        blocks = models.Block.objects.order_by('ordering')
        items = [marshal(block, get_serializer(type(block), block_fields))
                 for block in blocks]
        return items

    def post(self):
        data = block_parser.parse_args()
        doc_type = get_document(data['_cls'])
        if doc_type not in registered_blocks():
            abort(400)

        parser = get_parser(doc_type, block_parser)
        serializer = get_serializer(doc_type, block_fields)

        data = parser.parse_args()
        add_to_landing = data.pop('add_to_landing', True)
        block = doc_type.objects.create(**data)

        if add_to_landing:
            landing_inst = landing()
            landing_inst.blocks.append(block)
            landing_inst.save()

        return marshal(block, serializer)


@manager_api.resource('/blocks/types')
class BlockTypes(AuthResource):

    def get(self):
        return [{'type': cls._class_name,
                 'templates': get_template_list(cls),
                 'name': cls._meta.get('verbose_name', cls._class_name)
                 } for cls in registered_blocks()]


@manager_api.resource('/blocks/<block_id>')
class BlockView(AuthResource):

    def get(self, block_id):
        try:
            block = models.Block.objects.get(id=block_id)
            serializer = get_serializer(type(block), block_fields)
            return marshal(block, serializer)
        except models.Block.DoesNotExist:
            abort(404)

    def put(self, block_id):
        try:
            block = models.Block.objects.get(id=block_id)
            block_type = type(block)

            parser = get_parser(block_type, block_parser)
            serializer = get_serializer(block_type, block_fields)

            data = parser.parse_args()
            add_to_landing = data.pop('add_to_landing', True)
            block.modify(**data)

            if add_to_landing:
                landing_inst = landing()
                landing_inst.blocks.append(block)
                landing_inst.save()

            return marshal(block, serializer)
        except models.Block.DoesNotExist:
            abort(404)

    def delete(self, block_id):
        models.Block.objects.filter(id=block_id).delete()
        return {'success': True}


@manager_api.resource('/users')
class UserList(AdminResource):

    def get(self):
        return [marshal(user, user_fields) for user in models.User.objects()]

    @marshal_with(user_fields)
    def post(self):
        data = user_parser.parse_args()
        password = data.pop('password', None)
        user = models.User(**data)

        if password is not None:
            user.set_password(password)

        user.save()
        return user


@manager_api.resource('/users/<user_id>')
class UserView(AdminResource):

    @marshal_with(user_fields)
    def get(self, user_id):
        try:
            return models.User.objects.get(id=user_id)
        except models.User.DoesNotExist:
            abort(404)

    @marshal_with(user_fields)
    def put(self, user_id):
        user = models.User.objects.get(id=user_id)
        data = user_parser.parse_args()
        password = data.pop('password', None)

        if password is not None:
            user.set_password(password)
            user.save()

        if data:
            user.modify(**data)
        return user


@manager_api.resource('/media')
class MediaList(AuthResource):

    def get(self):
        return [marshal(media, media_fields)
                for media in models.Media.objects()]

    @marshal_with(media_fields)
    def post(self):
        data = media_parser.parse_args()
        media_obj = models.Media()
        media_obj.save(data['file'], current_app.config['MEDIA_ROOT'])
        return media_obj


@manager_api.resource('/media/<media_id>')
class MediaView(AuthResource):

    @marshal_with(media_fields)
    def get(self, media_id):
        return models.Media.objects.get(id=media_id)

    def delete(self, media_id):
        models.Media.objects.filter(id=media_id).delete()
        return {'success': True}
