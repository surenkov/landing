from os import path
from flask_wtf import Form
from wtforms import StringField
from landing import db
from landing.models import Block


class DummyForm(Form):
    data = StringField('Data')


class DummyBlock(Block):
    data = db.StringField()

    class Meta:
        verbose_name = 'Пустой блок'
        manager_form = DummyForm
