from flask_mongoengine import BaseQuerySet
from mongoengine.base import DocumentMetaclass
from landing import db
from landing.blocks import register_block, unregister_block


class BlockType(DocumentMetaclass):

    def __new__(cls, name, bases, attrs):
        new_cls = super().__new__(cls, name, bases, attrs)
        register_block(new_cls)
        return new_cls


@unregister_block
class Block(db.EmbeddedDocument, metaclass=BlockType):

    """ Base class for all landing blocks. """

    # DB saved params
    background = db.StringField()
    title = db.StringField()
    meta = {
        'abstract': True,
        'allow_inheritance': True
    }

    def render(self):
        pass

    def save(self, *args, **kwargs):
        pass

    def validate(self):
        pass


class LandingModel(db.Document):
    blocks = db.EmbeddedDocumentListField(Block)


class SingletonLandingFactory:
    _singleton = LandingModel.objects.first()

    def __call__(self):
        cls = type(self)
        if type(self)._singleton is None:
            type(self)._singleton = LandingModel()
        return type(self)._singleton


landing_factory = SingletonLandingFactory()