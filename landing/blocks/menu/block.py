from flask_wtf import Form
from landing import db
from landing.models import Block, landing_factory
from landing.fields import StringField
from landing.mixins import MenuItemMixin


class MenuForm(Form):
    title = StringField('Заголовок', description='Заголовок меню')
    button_caption = StringField('Надпись на кнопке', description='Кнопка')

 
class MenuBlock(Block):
    title = db.StringField()
    button_caption = db.StringField()

    def menu_items(self):
        blocks = landing_factory().blocks
        menu_blocks = filter(lambda b: isinstance(b, MenuItemMixin), blocks)
        return menu_blocks

    class Meta:
        verbose_name = 'Меню'
        manager_form = MenuForm
        template = 'menu/menu.html'
        template_assets = {
            'css': ['menu/style.css']
        }
