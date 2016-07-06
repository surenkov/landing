from wtforms import Form
from wtforms.validators import DataRequired, ValidationError
from landing import db
from landing.models import Block, landing_factory
from landing.fields import (TypedFieldList, MediaFileField, StringField,
                           FormField)


class MenuItemForm(Form):
    caption = StringField()
    block_id = StringField()


class MenuItem(db.EmbeddedDocument):
    caption = db.StringField()
    block_id = db.StringField()


class MenuForm(Form):
    title = StringField('Заголовок', description='Заголовок меню')
    image = MediaFileField('или логотип', description='/media/logo.png')
    button_caption = StringField('Надпись на кнопке', description='Кнопка')
    menu_items = TypedFieldList(MenuItem, FormField(MenuItemForm), label='Блоки')


class MenuBlock(Block):
    title = db.StringField()
    image = db.StringField()
    button_caption = db.StringField()
    menu_items = db.EmbeddedDocumentListField(MenuItem)

    class Meta:
        verbose_name = 'Меню'
        manager_form = MenuForm
        template = 'menu/menu.html'
        manager_template = 'menu/manager_template.html'
        template_assets = {
            'css': ['menu/style.css']
        }
