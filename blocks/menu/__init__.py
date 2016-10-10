from landing.models import *
from landing.utility.templates import template

from manager.utility.fields import block_fields, String, List, Raw
from manager.utility.parsers import block_parser


def menu_entry(entry):
    return MenuEntry(caption=entry.get('caption', ''),
                     block=Block.objects.filter(id=entry.get('block_id')).first())


class MenuEntryField(Raw):

    def format(self, value):
        return {
            'caption': value.caption,
            'block_id': str(value.block.id)
        }

menu_parser = block_parser.copy()
menu_parser.add_argument('title', type=str)
menu_parser.add_argument('links', type=menu_entry, action='append')

menu_serializer = block_fields.copy()
menu_serializer.update({
    'title': String,
    'links': List(MenuEntryField)
})


class MenuEntry(EmbeddedDocument):
    caption = StringField(default='')
    block = ReferenceField(Block)


class MenuBlock(Block):
    title = StringField(default='')
    links = EmbeddedDocumentListField(MenuEntry)

    meta = {
        'templates': {
            'default': template('template.html'),
        },
        'parser': menu_parser,
        'serializer': menu_serializer,
        'verbose_name': 'Основное меню'
    }

