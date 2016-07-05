from wtforms import Form
from landing import db
from landing.mixins import *
from landing.models import Block, unregister_block
from landing.fields import StringField, MediaFileField, TypedFieldList


class CalloutForm(Form, TitleFormMixin, DescriptionFormMixin):
    advanced_classes = StringField('Классы коллаута')
    image = MediaFileField('Изображение', description='/media/image.png')


@unregister_block
class Callout(db.EmbeddedDocument, TitleBlockMixin, DescriptionBlockMixin):
    advanced_classes = db.StringField()
    image = db.StringField()


class CalloutsForm(Form, TitleFormMixin):
    callouts = TypedFieldList(Callout, FormField(CalloutForm))


class CalloutsBlock(Block, TitleBlockMixin):
    callouts = db.EmbeddedDocumentListField(Callout)
    
    class Meta:
        verbose_name = 'Коллаут-блоки'
        manager_form = CalloutsForm
        manager_template = 'callouts/manager_template.html'
        template = 'callouts/template.html'
