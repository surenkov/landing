from .models import *


def order_pending(request) -> int:
    order_number = request['orderNumber']
    order = Order.objects(id=order_number).modify(status='pending')
    return 0 if order is not None else 100  # да, именно 100, не 200


def cancel_order(request) -> int:
    order_number = request['orderNumber']
    order = Order.objects(id=order_number).modify(status='cancelled')
    return 0 if order is not None else 200


def approve_order(request) -> int:
    order_number = request['orderNumber']
    order = Order.objects(id=order_number).modify(status='approved')
    return 0 if order is not None else 200
