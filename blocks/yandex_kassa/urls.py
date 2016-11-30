import xml.etree.ElementTree as ET

from flask import request, redirect, url_for
from flask_restful import Resource, marshal_with, marshal

from landing import landing_app, landing_api
from manager.api import AuthResource, manager_api

from .ya_kassa import YandexKassaApiHelper
from .models import Order, order_fields


_payment_action_dispatcher = {
    'check': 'checkOrder',
    'aviso': 'paymentAviso'
}


def get_kassa():
    from . import KassaBlock
    return KassaBlock.objects.first()


@landing_app.route('/pay/<action>', methods=['GET', 'POST'])
def payment_url_dispatcher(action: str):
    kassa_action = _payment_action_dispatcher.get(action)

    if kassa_action is not None and request.method == 'POST':
        config = get_kassa().config
        parsed_request = ET.fromstring(request.data).attrib
        kassa = YandexKassaApiHelper(kassa_action, config)
        return kassa(parsed_request), 200
    else:
        return redirect(url_for('index', payment_action=action))


@landing_api.resource('/pay/create')
class OrderCreateView(Resource):

    def post(self):
        request_data = request.get_json()

        order_type_id = request_data['order_type_id'].strip()
        customer_email = request_data['email'].strip()

        kassa = get_kassa()
        order_type = kassa.order_types.get(id=order_type_id)
        order = Order.objects.create(type=order_type, parameters=request_data)

        return {
            'customerNumber': customer_email,
            'orderNumber': str(order.id),
            'shopId': kassa.config.shop_id,
            'scid': kassa.config.sc_id,
        }


@manager_api.resource('/pay')
class OrderListView(AuthResource):

    def get(self):
        return [marshal(order, order_fields) for order in Order.objects()]


@manager_api.resource('/pay/<order_id>')
class OrderView(AuthResource):

    @marshal_with(order_fields)
    def get(self, order_id):
        return Order.objects.get(id=order_id)

    @marshal_with(order_fields)
    def put(self, order_id):
        req_data = request.get_json()
        return Order.objects(id=order_id).modify(
            status=req_data.get('status', 'created')
        )

    def delete(self, order_id):
        return Order.objects(id=order_id).delete()
