from landing.models import *
from landing.utility.templates import template

from manager.utility.fields import block_fields, String
from manager.utility.parsers import block_parser


header_parser = block_parser.copy()
header_parser.add_argument('title', type=str)

header_serializer = block_fields.copy()
header_serializer.update({
    'title': String
})


class HeaderBlock(Block):
    title = StringField(default='')

    meta = {
        'templates': {
            'default': template('template.html'),
        },
        'parser': header_parser,
        'serializer': header_serializer,
        'verbose_name': 'Шапка сайта'
    }

