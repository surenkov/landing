import re
from wtforms.validators import ValidationError
from landing import db
from landing.fields import *


class BackgroundFormMixin:
    background_color = StringField('Цвет фона', description='#ABCDEF')
    background_media = MediaFileField(
        'Изображение или видео', description='/media/image.png')

    def validate_background_color(form, field):
        v_re = [
            r'^#([0-9a-f]{3}|[0-9a-f]{6})$',
            r'^rgba\(\s?(([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),\s?){3}' +
            r'([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s?\)$',
            r'^rgb\(\s?(([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),\s?){2}' +
            r'([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s?\)$'
        ]
        matches = any(filter(lambda r: re.match(r, field.data, re.I), v_re))
        if field.data and not matches:
            raise ValidationError('Цвет задан в неправильном формате.')


class BackgroundBlockMixin:
    """Mixin for blocks with background color, image or video.
    """
    background_color = db.StringField()
    background_media = db.StringField()


class TitleFormMixin:
    title = StringField('Заголовок', description='Заголовок блока')


class TitleBlockMixin:
    """Mixin for blocks with title.
    """
    title = db.StringField()


class DescriptionFormMixin:
    description = TextAreaField('Описание', description='Описание')


class DescriptionBlockMixin:
    """Mixin for blocks with description.
    """
    description = db.StringField()
