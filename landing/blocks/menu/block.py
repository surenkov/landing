from flask_wtf import Form
from landing import db
from landing.models import Block
from landing.fields import StringField, SelectField, FormField


class MenuForm(Form):

    class ButtonForm(Form):
        link = StringField('Ссылка')
        caption = StringField('Надпись', description='Связаться с нами')

    def populate_obj(self, obj):
        if isinstance(obj, MenuBlock) \
                and getattr(obj, 'button', None) is None:
            obj.button = Button()
        return super().populate_obj(obj)

    button = FormField(ButtonForm, 'Кнопка')


class Button(db.EmbeddedDocument):
    link = db.StringField()
    caption = db.StringField()

   
class MenuBlock(Block):
    button = db.EmbeddedDocumentField(Button)

    class Meta:
        verbose_name = 'Блок меню'
        manager_form = MenuForm
        template = 'menu/menu.html'