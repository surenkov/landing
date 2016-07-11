from flask import request, abort, jsonify
from flask_mail import Message
from flask_wtf import Form
from wtforms.validators import Email, DataRequired
from landing import mail
from landing.mixins import *
from landing.models import Block, landing_factory


class SendmailManagerForm(Form, TitleFormMixin, DescriptionFormMixin):
    email_subject = StringField('Тема', description='Тема сообщения')
    email_from = StringField(label='Email отправителя',
                             description='ivanov.i@example.com',
                             validators=[Email(), DataRequired()])
    email_to = StringField(label='Email получателя',
                           description='petrov.v@example.com',
                           validators=[Email(), DataRequired()])
    success_message = TextAreaField(label='Сообщение об успешной отправке',
                                    description='Мы уже летим к вам!',
                                    validators=[DataRequired()])


class SendmailFrontForm(Form):
    email = StringField(validators=[Email(message='Email введён в ' +
                                          'неправильном формате.')],
                        description='ivanov.i@example.com')
    phone = StringField(description='+7 123 123-45-67')
    content = TextAreaField(description='Текст сообщения.')


class MessageModel(db.Document):
    email = db.StringField()
    phone = db.StringField()
    content = db.StringField()

    def send(self):

        def get(attr, default=''):
            return getattr(self._block, attr) if hasattr(self, '_block') \
                else default

        message = Message(subject=get('email_subject'),
                          sender=get('email_from'),
                          recipients=[get('email_to')],
                          html='')
        # mail.send(message)


@app.route('/send/<block_id>', methods=['POST'])
def send_mail(block_id):
    try:
        block = landing_factory().blocks.get(id=block_id)
    except Block.DoesNotExist:
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
    email_from = db.StringField()
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
