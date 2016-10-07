from bson import ObjectId
from flask_restful import reqparse, inputs
from werkzeug.datastructures import FileStorage
from landing.models import Block, USER_ROLES


def reference_argument(block_id, name):
    try:
        return Block.objects.get(id=block_id)
    except Block.DoesNotExist as e:
        raise ValueError('There is no block for "{}".'.format(name)) from e


def choices_input(*choices):
    def parser(choice, name):
        if choice not in choices:
            raise ValueError('Value "{0}" of "{2}" not in "{1}" choices.'
                             .format(choice, ', '.join(choices), name))
        return choice
    return parser


def finite_string(min_length=0, max_length=float('inf')):
    def parser(value, name):
        value = str(value)
        str_len = len(value)
        if str_len < min_length:
            raise ValueError('"%s" cannot be shorter than %d chars.'
                             % (name, min_length))
        if str_len > max_length:
            raise ValueError('"%s" cannot be longer than %d chars.'
                             % (name, max_length))
        return value
    return parser

landing_parser = reqparse.RequestParser(bundle_errors=True)
landing_parser.add_argument('name', type=str, store_missing=False)
landing_parser.add_argument(
    'meta',
    type=dict,
    dest='meta_info',
    store_missing=False
)

block_parser = reqparse.RequestParser(bundle_errors=True)
block_parser.add_argument('id', type=ObjectId, store_missing=False)
block_parser.add_argument('type', type=str, dest='_cls', store_missing=False)
block_parser.add_argument('enabled', type=bool, store_missing=False)
block_parser.add_argument('template', type=str, store_missing=False)
block_parser.add_argument('ordering', type=int, store_missing=False)


media_parser = reqparse.RequestParser(bundle_errors=True)
media_parser.add_argument('file', type=FileStorage, location='files')

user_parser = reqparse.RequestParser(bundle_errors=True)
user_parser.add_argument('id', type=ObjectId, store_missing=False)
user_parser.add_argument('name', type=str, required=True)
user_parser.add_argument(
    'password', type=finite_string(6), store_missing=False
)
user_parser.add_argument(
    'role',
    type=choices_input(*list(map(lambda r: r[0], USER_ROLES))),
    required=True
)
user_parser.add_argument(
    'email',
    type=inputs.regex(r'^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|'
                      r'(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+'
                      r'[^<>()[\]\.,;:\s@\"]{2,})$'),
    required=True
)

