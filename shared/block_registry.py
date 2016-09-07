from mongoengine.base import TopLevelDocumentMetaclass

__all__ = [
    'register_block',
    'unregister_block',
    'registered_blocks',
    'BlockMetaclass'
]
_block_registry = dict()


def register_block(cls):
    _block_registry[cls.__name__] = cls


def unregister_block(cls):
    del _block_registry[cls.__name__]


def registered_blocks():
    return dict(_block_registry)


class BlockMetaclass(TopLevelDocumentMetaclass):

    def __call__(cls, *args, **kwargs):
        register_block(cls)
        return super().__call__(*args, **kwargs)
