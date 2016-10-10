from landing.models import *
from landing.utility.templates import template

from manager.utility.fields import *
from manager.utility.parsers import block_parser


def position_parser(pos):
    return Position(**pos)


def options_parser(opt):
    return Options(**opt)


def organization_parser(org):
    return Organization(**org)


map_parser = block_parser.copy()
map_parser.add_argument('pos', type=position_parser, dest='position')
map_parser.add_argument('opt', type=options_parser, dest='options')
map_parser.add_argument('org', type=organization_parser, dest='organization')

map_serializer = block_fields.copy()
map_serializer.update({
    'pos': Nested({
        'lat': Float,
        'lon': Float,
        'zoom': Integer
    }, attribute='position'),
    'opt': Nested({
        'city': String
    }, attribute='options'),
    'org': Nested({
        'id': String
    }, attribute='organization')
})


class Position(EmbeddedDocument):
    lat = FloatField()
    lon = FloatField()
    zoom = IntField(min_value=1, max_value=18)


class Options(EmbeddedDocument):
    city = StringField()


class Organization(EmbeddedDocument):
    id = StringField()


class MapBlock(Block):
    position = EmbeddedDocumentField(Position)
    options = EmbeddedDocumentField(Options)
    organization = EmbeddedDocumentField(Organization)

    meta = {
        'templates': {
            'full width': template('template.html'),
        },
        'parser': map_parser,
        'serializer': map_serializer,
        'verbose_name': 'Карта 2GIS'
    }
