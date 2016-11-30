from decimal import Decimal
from bson import ObjectId

from landing.models import *
from manager.utility import fields


def order_type(entry):
    return OrderType(
        name=entry['name'],
        price=Decimal(entry['price'])
    )


order_fields = {
    'type': fields.Nested({
        'name': fields.String,
        'price': fields.Fixed(decimals=2),
    }),
    'parameters': fields.Raw,
    'status': fields.String
}


class OrderType(EmbeddedDocument):
    id = ObjectIdField(default=ObjectId)
    name = StringField(required=True)
    price = DecimalField(required=True)


class ShopConfig(EmbeddedDocument):
    shop_id = IntField(required=True)
    sc_id = IntField(required=True)
    shop_password = StringField(required=True)


class Order(Document):
    type = EmbeddedDocumentField(OrderType)
    parameters = DictField()
    status = StringField(
        choices=('created', 'pending', 'approved', 'cancelled'),
        default='created',
        required=True
    )

