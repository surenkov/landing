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
order_parser.add_argument('body', type=str)

order_block_parser = block_parser.copy()
order_block_parser.add_argument('email_from', type=email_input)
order_block_parser.add_argument('email_to', type=email_input)
order_block_parser.add_argument('subject', type=str)
order_block_parser.add_argument('body', type=str)

order_block_serializer = block_fields.copy()
order_block_serializer.update({
    'email_from': String,
    'email_to': String,
    'subject': String,
    'body': String
})


@landing_api.resource('/order/<id>')
class OrderView(Resource):

    def post(self, id):
        order_block = OrderBlock.objects.get(id=id)
        data = order_parser.parse_args()

        subject = order_block.subject.format(**data)
        body = order_block.body.format(**data)

        landing_mail.send(Message(
            subject,
            html=body,
            sender=order_block.email_from,
            recipients=[order_block.email_to]
        ))
        return {'success': True}


class Order(Document):
    name = StringField()
    email_or_phone = StringField()
    order_text = StringField()


class OrderBlock(Block):
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
