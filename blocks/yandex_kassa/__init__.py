from landing.utility.templates import template
from manager.utility import parsers

from .models import *
from .urls import *


def shop_config(entry):
    return ShopConfig(
        shop_id=entry['shop_id'],
        sc_id=entry['sc_id'],
        shop_password=entry['shop_password']
    )

kassa_fields = fields.block_fields.copy()
kassa_fields.update({
    'config': fields.Nested({
        'shop_id': fields.Integer,
        'sc_id': fields.Integer,
        'shop_password': fields.String
    }),
    'order_types': fields.List(fields.Nested({
        'name': fields.String,
        'price': fields.Fixed(decimals=2)
    }))
})

kassa_parser = parsers.block_parser.copy()
kassa_parser.add_argument('config', type=shop_config)
kassa_parser.add_argument('order_types', type=order_type, action='append')


class KassaBlock(Block):
    config = EmbeddedDocumentField(ShopConfig)
    order_types = EmbeddedDocumentListField(OrderType)

    meta = {
        'templates': {
            'default': template('assets/template.html')
        },
        'parser': kassa_parser,
        'serializer': kassa_fields,
        'verbose_name': 'Форма оплаты Яндекс.Кассы'
    }
