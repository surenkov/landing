from mongoengine.base import TopLevelDocumentMetaclass
from mongoengine import fields

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
_parser_registry = dict()
_serializer_registry = dict()


def register_block(cls):
    _cls_registry.add(cls)
    return cls


def unregister_block(cls):
    _cls_registry.discard(cls)
    return cls


def registered_blocks():
    return _cls_registry.copy()


def parse_with(parser):
    def registry(cls):
        _parser_registry[cls] = parser
        return cls
    return registry


def get_parser(cls, default=None):
    return _parser_registry.get(cls, default)


def marshal_with(serializer):
    def registry(cls):
        _serializer_registry[cls] = serializer
        return cls
    return registry


def get_serializer(cls, default=None):
    return _serializer_registry.get(cls, default)


def update_document(document, data_dict):

    def field_value(field, value):

        if field.__class__ in (fields.ListField, fields.SortedListField):
            return [
                field_value(field.field, item)
                for item in value
                ]
        if field.__class__ in (
                fields.EmbeddedDocumentField,
                fields.GenericEmbeddedDocumentField,
                fields.ReferenceField,
                fields.GenericReferenceField
        ):
            return field.document_type(**value)
        else:
            return value

    [setattr(
        document, key,
        field_value(document._fields[key], value)
    ) for key, value in data_dict.items()]

    return document


class BlockMetaclass(TopLevelDocumentMetaclass):

    def __new__(mcs, *args, **kwargs):
        new_cls = super().__new__(mcs, *args, **kwargs)
        register_block(new_cls)
        return new_cls


