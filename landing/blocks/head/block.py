from flask_wtf import Form
from landing import db
from landing.models import Block
from landing.fields import StringField, UploadMediaFileField
from landing.mixins import *


class HeadForm(Form, TitleFormMixin, BackgroundFormMixin, MenuFormMixin):
    pass


class HeadBlock(Block, TitleBlockMixin, BackgroundBlockMixin, MenuItemMixin):

    class Meta:
        verbose_name = 'Блок с заголовком'
        manager_form = HeadForm
        template = 'head/head.html'
