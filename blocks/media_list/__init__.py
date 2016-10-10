from landing.models import *
from landing.utility.templates import template

from manager.utility.fields import *
from manager.utility.parsers import block_parser


def media_entry(entry):
    return MediaListEntry(
        caption=entry.get('caption'),
        media=Media.objects.filter(id=entry['media']['id']).first()
    )


list_parser = block_parser.copy()
list_parser.add_argument('title', type=str)
list_parser.add_argument('items', type=media_entry, action='append')

list_serializer = block_fields.copy()
list_serializer.update({
    'title': String,
    'items': List(Nested({
        'caption': String,
        'media': Nested(media_fields)
    }))
})


class MediaListEntry(EmbeddedDocument):
    caption = StringField(default='')
    media = ReferenceField(Media)


class MediaListBlock(Block):
    title = StringField(default='')
    items = EmbeddedDocumentListField(MediaListEntry)

    meta = {
        'templates': {
            'default': template('template.html'),
        },
        'parser': list_parser,
        'serializer': list_serializer,
        'verbose_name': 'Список с изображениями'
    }

