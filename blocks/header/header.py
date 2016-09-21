from landing.models import Block
from landing.utility.templates import set_templates


@set_templates('header', ['default'])
class HeaderBlock(Block):
    pass

