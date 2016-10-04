from landing.models import *
from landing.utility.templates import set_templates
from landing.utility.blocks import parse_with, marshal_with

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


@set_templates('header', ['default'])
@parse_with(header_parser)
@marshal_with(header_serializer)
class HeaderBlock(Block):
    title = StringField(default='')
    button = ReferenceField(Block)
