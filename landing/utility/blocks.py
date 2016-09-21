from mongoengine.base import TopLevelDocumentMetaclass
__all__ = [
    'register_block',
    'unregister_block',
    'registered_blocks'
]
_cls_registry = set()


def register_block(cls):
    _cls_registry.add(cls)
    return cls


def unregister_block(cls):
    _cls_registry.discard(cls)
    return cls


def registered_blocks():
    return set(_cls_registry)


class BlockMetaclass(TopLevelDocumentMetaclass):

    def __call__(cls, *args, **kwargs):
        register_block(cls)
        return super().__call__(*args, **kwargs)
