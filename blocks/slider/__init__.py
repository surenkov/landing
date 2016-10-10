from landing.models import *
from landing.utility.templates import template

from manager.utility.fields import *
from manager.utility.parsers import block_parser


def slide(entry):
    return Slide(
        description=entry.get('description'),
        media=Media.objects.filter(id=entry['media']['id']).first()
    )


slider_parser = block_parser.copy()
slider_parser.add_argument('title', type=str)
slider_parser.add_argument('items', type=slide, action='append')

slider_serializer = block_fields.copy()
slider_serializer.update({
    'title': String,
    'items': List(Nested({
        'description': String,
        'media': Nested(media_fields)
    }))
})


class Slide(EmbeddedDocument):
    description = StringField(default='')
    media = ReferenceField(Media)


class SliderBlock(Block):
    title = StringField(default='')
    items = EmbeddedDocumentListField(Slide)

    meta = {
        'templates': {
            'default': template('template.html'),
        },
        'parser': slider_parser,
        'serializer': slider_serializer,
        'verbose_name': 'Слайдер'
    }

