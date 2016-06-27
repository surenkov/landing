from flask_wtf import Form
from landing import db
from landing.models import Block
from landing.fields import StringField
from landing.mixins import *


class NarrationForm(Form, TitleFormMixin,
                    DescriptionFormMixin, MenuFormMixin):
    font_family = StringField('Шрифт', 
                              description='Helvetica, Arial, sans-serif')


class NarrationBlock(Block, TitleBlockMixin,
                     DescriptionBlockMixin, MenuItemMixin):
    font_family = db.StringField()

    class Meta:
        verbose_name = 'Блок с описанием'
        template = 'narration/template.html'
        manager_form = NarrationForm