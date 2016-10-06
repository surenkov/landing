from landing.models import *
from landing.utility.templates import template

from manager.utility.fields import block_fields, Reference, String
from manager.utility.parsers import block_parser, reference_argument


header_parser = block_parser.copy()
header_parser.add_argument('title', type=str)
header_parser.add_argument('button', type=reference_argument)

header_serializer = block_fields.copy()
header_serializer.update({
    'title': String,
    'button': Reference
})


class HeaderBlock(Block):
    title = StringField(default='')
    button = ReferenceField(Block)

    meta = {
        'templates': {
            'default': template('templates/template.html'),
            'partial': template('templates/template.html')
        },
        'parser': header_parser,
        'serializer': header_serializer,
        'verbose_name': 'Шапка сайта'
    }
