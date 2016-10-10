from landing.models import *
from landing.utility.templates import template

from manager.utility.fields import block_fields, String
from manager.utility.parsers import block_parser


text_parser = block_parser.copy()
text_parser.add_argument('title', type=str)
text_parser.add_argument('text', type=str)

text_serializer = block_fields.copy()
text_serializer.update({
    'title': String,
    'text': String
})


class TextBlock(Block):
    title = StringField(default='')
    text = StringField(default='')

    meta = {
        'templates': {
            'default': template('template.html'),
        },
        'parser': text_parser,
        'serializer': text_serializer,
        'verbose_name': 'Описание'
    }

