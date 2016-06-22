import re
from wtforms.validators import DataRequired, ValidationError
from landing import db
from landing.fields import *
from landing.models import landing_factory


class BackgroundFormMixin:
    background_color = StringField('Цвет фона', description='#ABCDEF')
    background_image = UploadMediaFileField('Фоновое изображение')
    background_video = UploadMediaFileField('или видео')

    def validate_background_color(form, field):
        v_re = [
            '^#([0-9a-f]{3}|[0-9a-f]{6})$',
            '^rgba\(\s?(([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),\s?){3}' +
            '([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s?\)$',
            '^rgb\(\s?(([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),\s?){2}' +
            '([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s?\)$'
        ]
        matches = any(filter(lambda r: re.match(r, field.data, re.I), v_re))
        if field.data and not matches:
            raise ValidationError('Цвет задан в неправильном формате.')



class BackgroundBlockMixin:
    """Mixin for blocks with background color, image or video.
    """
    background_color = db.StringField()
    background_image = db.StringField()
    background_video = db.StringField()


class TitleFormMixin:
    title = StringField('Заголовок', description='Заголовок блока')


class TitleBlockMixin:
    """Mixin for blocks with title.
    """
    title = db.StringField()


class MenuFormMixin:
    menu_title = StringField('Заголовок меню', validators=[DataRequired()],
                             description='Заголовок меню')


class MenuItemMixin:
    """Mixin for blocks, shown in menu.
    """
    menu_title = db.StringField()