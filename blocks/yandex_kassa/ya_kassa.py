import xml.etree.ElementTree as ET

from datetime import datetime
from hashlib import md5
from itertools import chain

from .handlers import order_pending, cancel_order, approve_order


class YandexKassaApiHelper:

    def __init__(self, action, config):
        self.action = action
        self.config = config

    def __call__(self, request):
        if not self._check_md5(request):
            cancel_order(request)
            return self._build_response(self.action, request['invoiceId'], 1)

        action = self.action
        if action == 'checkOrder':
            return self.check_order(request)
        elif action == 'paymentAviso':
            return self.payment_aviso(request)

    def check_order(self, request):
        action = request['action']
        invoice_id = request['invoiceId']
        if action == 'checkOrder':
            status = order_pending(request)
        else:
            status = cancel_order(request)
        return self._build_response(action, invoice_id, status)

    def payment_aviso(self, request):
        status = approve_order(request)
        invoice_id = request['invoiceId']
        return self._build_response('paymentAviso', invoice_id, status)

    def _build_response(self, function_name, invoice_id,
                        result_code, message=None):
        response_el = ET.Element('%sResponse' % function_name, dict(
            performedDatetime=datetime.now().strftime('%Y-%m-%dT%H:%M:%S.000Z'),
            code=str(result_code),
            invoiceId=invoice_id,
            shopId=self.config.shop_id
        ))
        if message is not None:
            response_el.set('message', message)
        return ET.tostring(response_el, encoding='unicode')

    def _check_md5(self, request):
        check_fields = ['action', 'orderSumAmount', 'orderSumCurrencyPaycash',
                        'orderSumBankPaycash', 'shopId', 'invoiceId',
                        'customerNumber']
        check_str = ';'.join(chain(
            map(lambda key: request['key'], check_fields),
            [self.config.shop_password]))
        digest = md5(check_str.encode()).hexdigest()
        return digest.upper() == request['md5'].upper()
