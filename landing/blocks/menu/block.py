from wtforms import Form
from landing import db
from landing.models import Block
from landing.fields import (TypedFieldList, MediaFileField, StringField,
                            FormField, PlaceholderWidget)


class MenuItemForm(Form):
    caption = StringField()
    block_id = StringField()


class MenuItem(db.EmbeddedDocument):
    caption = db.StringField()
    block_id = db.StringField()


class MenuButtonForm(Form):
    caption = StringField('Надпись', description='Надпись на кнопке')
    block_id = StringField('Переход на блок',
                           widget=PlaceholderWidget(),
                           description='Блок')


class MenuForm(Form):
    title = StringField('Заголовок', description='Заголовок меню')
    image = MediaFileField('или логотип', description='/media/logo.png')
    button = FormField(MenuButtonForm, label='Кнопка')
    menu_items = TypedFieldList(MenuItem, FormField(MenuItemForm),
                                label='Блоки')

    def populate_obj(self, obj):
        if obj.button is None:
            obj.button = MenuItem()
        super().populate_obj(obj)


class MenuBlock(Block):
    title = db.StringField()
    image = db.StringField()
    button = db.EmbeddedDocumentField(MenuItem)
    menu_items = db.EmbeddedDocumentListField(MenuItem)

    class Meta:
        verbose_name = 'Меню'
        manager_form = MenuForm
        template = 'menu/menu.html'
        manager_template = 'menu/manager_template.html'
        template_assets = {
            'css': ['menu/style.css']
        }
