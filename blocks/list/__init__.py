from landing.models import *
from landing.utility.templates import template

from manager.utility.fields import block_fields, String, List
from manager.utility.parsers import block_parser


list_parser = block_parser.copy()
list_parser.add_argument('title', type=str)
list_parser.add_argument('items', type=str, action='append')

list_serializer = block_fields.copy()
list_serializer.update({
    'title': String,
    'items': List(String)
})


class ListBlock(Block):
    title = StringField(default='')
    items = ListField(StringField(default=''))

    meta = {
        'templates': {
            'ordered': template('template.html'),
        },
        'parser': list_parser,
        'serializer': list_serializer,
        'verbose_name': 'Список'
    }

