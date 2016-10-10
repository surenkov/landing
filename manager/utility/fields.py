from flask_restful.fields import *


class ObjectId(Raw):
    def format(self, value):
        return str(value)


class Reference(Raw):
    def format(self, value):
        return str(value.id)


landing_fields = {
    'name': String,
}

block_fields = {
    'id': ObjectId,
    'type': String(attribute='_cls'),
    'enabled': Boolean,
    'template': String,
    'ordering': Integer
}

media_fields = {
    'id': ObjectId,
    'mime_type': Raw,
    'file_url': String
}

user_fields = {
    'id': ObjectId,
    'name': String,
    'email': String,
    'role': String
}
