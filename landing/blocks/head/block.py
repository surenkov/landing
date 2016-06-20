from flask_wtf import Form
from landing import db
from landing.models import Block
from landing.fields import StringField, UploadMediaFileField


class HeadForm(Form):
    title = StringField('Заголовок', description='Заголовок блока')
    background = UploadMediaFileField('Фоновое изображение')


class HeadBlock(Block):
    title = db.StringField()
    background = db.StringField()

    class Meta:
        verbose_name = 'Блок с заголовком'
        manager_form = HeadForm
