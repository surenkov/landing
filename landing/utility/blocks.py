from mongoengine.base import TopLevelDocumentMetaclass

__all__ = [
    'register_block',
    'unregister_block',
    'registered_blocks',

    'parse_with',
    'get_parser',

    'marshal_with',
    'get_serializer',

    'update_document'
]

_cls_registry = set()


def register_block(cls):
    _cls_registry.add(cls)
    return cls


def unregister_block(cls):
    _cls_registry.discard(cls)
    return cls


def registered_blocks():
    return _cls_registry.copy()


def get_parser(cls, default=None):
    return cls._meta.get('parser', default)


def get_serializer(cls, default=None):
    return cls._meta.get('serializer', default)


class BlockMetaclass(TopLevelDocumentMetaclass):

    def __new__(mcs, *args, **kwargs):
        new_cls = super().__new__(mcs, *args, **kwargs)
        register_block(new_cls)
        return new_cls


