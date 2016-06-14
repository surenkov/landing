from landing import db
from landing.models import Block


class HeadBlock(Block):
    title = db.StringField()
    background = db.StringField()

    class Meta:
        verbose_name = ''
        manager_form = None
        template = None
