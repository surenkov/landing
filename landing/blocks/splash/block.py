from flask_wtf import Form
from landing.mixins import *
from landing.models import Block


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