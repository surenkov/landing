from landing.models import *
from landing.api import *
from landing.mail import landing_mail, Message
from landing.utility.templates import template

from manager.utility.fields import *
from manager.utility.parsers import block_parser, email


email_input = email()

order_parser = reqparse.RequestParser()
order_parser.add_argument('name', type=str)
order_parser.add_argument('email_or_phone', type=str)
order_parser.add_argument('order_message', type=str)

order_block_parser = block_parser.copy()
order_block_parser.add_argument('title', type=str)
order_block_parser.add_argument('success_message', type=str)
order_block_parser.add_argument('fail_message', type=str)
order_block_parser.add_argument('button_text', type=str)

order_block_parser.add_argument('email_from', type=email_input)
order_block_parser.add_argument('email_to', type=email_input)
order_block_parser.add_argument('subject', type=str)
order_block_parser.add_argument('body', type=str)

order_block_serializer = block_fields.copy()
order_block_serializer.update({
    'title': String,
    'success_message': String,
    'fail_message': String,
    'button_text': String,

    'email_from': String,
    'email_to': String,
    'subject': String,
    'body': String
})


@landing_api.resource('/order/<id>', endpoint='send_mail')
class OrderView(Resource):

    def post(self, id):
        order_block = OrderBlock.objects.get(id=id)
        data = order_parser.parse_args()

        order = Order.objects.create(**data)
        message = order.create_mail(
            order_block.subject,
            order_block.body,
            order_block.email_from,
            order_block.email_to
        )

        landing_mail.send(message)
        return {'success': True}


class Order(Document):
    name = StringField()
    email_or_phone = StringField()
    order_message = StringField()

    def _format(self, string):
        return string.format(
            name=self.name,
            email_or_phone=self.email_or_phone,
            order_message=self.order_message
        )

    def create_mail(self, subject, template, sender, recipient):
        return Message(
            sender=sender,
            recipients=[recipient],
            subject=self._format(subject),
            html=self._format(template)
        )


class OrderBlock(Block):
    title = StringField(default='')
    success_message = StringField(default='')
    fail_message = StringField(default='')
    button_text = StringField(default='')

    email_from = EmailField()
    email_to = EmailField()
    subject = StringField()
    body = StringField()

    meta = {
        'templates': {
            'default': template('template.html')
        },
        'parser': order_block_parser,
        'serializer': order_block_serializer,
        'verbose_name': 'Форма отправки сообщения'
    }
