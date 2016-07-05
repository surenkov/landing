from wtforms import Form
from landing import db
from landing.mixins import *
from landing.models import Block, unregister_block
from landing.fields import StringField, MediaFileField, TypedFieldList


class ListsForm(Form, TitleFormMixin, DescriptionFormMixin):
    pass


@unregister_block
class ListItem(Block, TitleBlockMixin, DescriptionBlockMixin):
    pass


class ListsForm(Form, TitleFormMixin):
    lists = TypedFieldList(ListItem, FormField(ListsForm))


class ListsBlock(Block, TitleBlockMixin):
    lists = db.EmbeddedDocumentListField(ListItem)
    
    class Meta:
        verbose_name = 'Нумерованый список'
        manager_form = ListsForm
        manager_template = 'lists/manager_template.html'
        template = 'lists/template.html'
