from flask_wtf import Form
from landing import db
from landing.models import Block, landing_factory
from landing.fields import StringField, SelectField, FormField
from landing.mixins import MenuItemMixin


class MenuForm(Form):

    class ButtonForm(Form):
        link = StringField('Ссылка')
        caption = StringField('Надпись', description='Связаться с нами')

    def populate_obj(self, obj):
        if isinstance(obj, MenuBlock) \
                and getattr(obj, 'button', None) is None:
            obj.button = Button()
        return super().populate_obj(obj)

    title = StringField('Заголовок', description='Заголовок меню')
    button = FormField(ButtonForm, 'Кнопка')


class Button(db.EmbeddedDocument):
    link = db.StringField()
    caption = db.StringField()

   
class MenuBlock(Block):
    title = db.StringField()
    button = db.EmbeddedDocumentField(Button)

    def menu_items(self):
        landing = landing_factory()
        menu_blocks = filter(lambda b: isinstance(b, MenuItemMixin),
                             landing.blocks)
        return menu_blocks


    class Meta:
        verbose_name = 'Меню'
        manager_form = MenuForm
        template = 'menu/menu.html'