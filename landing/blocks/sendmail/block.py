from flask import request, abort, jsonify, render_template
from flask_mail import Message
from flask_wtf import Form
from wtforms.validators import Email, DataRequired
from mongoengine import DoesNotExist
from landing import app, mail
from landing.mixins import *
from landing.models import Block, landing_factory


class SendmailManagerForm(Form, TitleFormMixin, DescriptionFormMixin):
    email_subject = StringField('Тема', description='Тема сообщения')
    email_to = StringField(label='Email получателя',
                           description='petrov.v@example.com',
                           validators=[Email(), DataRequired()])
    success_message = TextAreaField(label='Сообщение об успешной отправке',
                                    description='Мы уже летим к вам!',
                                    validators=[DataRequired()])


class SendmailFrontForm(Form):
    name = StringField(
        validators=[DataRequired(message='Расскажите нам, как вас зовут.')],
        description='Как вас зовут?')
    contacts = StringField(description='Телефон или email.')
    content = TextAreaField(description='Опишите суть проекта.')


class MessageModel(db.Document):
    name = db.StringField()
    contacts = db.StringField()
    content = db.StringField()

    def send(self):

        def get(attr, default=''):
            return getattr(self._block, attr) if hasattr(self, '_block') \
                else default

        message = Message(subject=get('email_subject'),
                          recipients=[get('email_to')],
                          html=render_template('sendmail/mail_template.html',
                                               name=self.name,
                                               contacts=self.contacts,
                                               content=self.content))
        mail.send(message)


@app.route('/send/<block_id>', methods=['POST'])
def send_mail(block_id):
    try:
        block = landing_factory().blocks.get(id=block_id)
    except DoesNotExist:
        block = None
        abort(404)

    if not isinstance(block, SendmailBlock):
        abort(404)

    message = block.create_message()
    form = SendmailFrontForm(request.form, message)
    if not form.validate_on_submit():
        return jsonify(form.errors), 400

    form.populate_obj(message)
    message.save()
    message.send()
    return ''


class SendmailBlock(Block, TitleBlockMixin, DescriptionBlockMixin):
    email_to = db.StringField()
    email_subject = db.StringField()
    success_message = db.StringField()

    def render_template(self, **kwargs):
        form = SendmailFrontForm()
        return super().render_template(form=form, **kwargs)

    def create_message(self):
        message = MessageModel()
        message._block = self
        return message

    class Meta:
        verbose_name = 'Форма отправки сообщения'
        manager_form = SendmailManagerForm
        template = 'sendmail/template.html'
        template_assets = {
            'css': ('sendmail/dist/mail.css', )
        }
