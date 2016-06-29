from flask_wtf import Form
from landing import db
from landing.models import Block
from landing.fields import StringField 
from landing.mixins import *


class SplashForm(Form, TitleFormMixin, DescriptionFormMixin,
                 BackgroundFormMixin):
    pass


class SplashBlock(Block, TitleBlockMixin, DescriptionBlockMixin,
                  BackgroundBlockMixin):

    class Meta:
        verbose_name = 'Сплэш-блок'
        manager_form = SplashForm
        template = 'splash/template.html'
        template_assets = {
            'css': ['splash/style.css']
        }