import sys
from flask import render_template, render_template_string
from flask_mongoengine import BaseQuerySet
from flask_mongoengine.wtf import model_form
from flask_wtf import Form
from mongoengine.base import DocumentMetaclass
from mongoengine import Document
from bson import ObjectId
from landing import app, db
from landing.blocks import register_block, unregister_block


class BlockType(DocumentMetaclass):

    def __new__(cls, name, bases, attrs):
        new_class = super().__new__(cls, name, bases, attrs)
        register_block(new_class)
        bases_meta = []
        for mro_class in new_class.mro():
            if 'Meta' in mro_class.__dict__:
                bases_meta.append(mro_class.Meta)
        meta_object = { 'verbose_name': str(new_class) }
        for meta in reversed(bases_meta):
            for param, val in meta.__dict__.items():
                if param.startswith('_'): continue
                meta_object[param] = val
        new_class._block_meta = meta_object
        return new_class


@unregister_block
class Block(db.EmbeddedDocument, metaclass=BlockType):
    """ Base class for all landing blocks. """

    id = db.ObjectIdField(primary_key=True, default=ObjectId)

    meta = {
        'abstract': True,
        'allow_inheritance': True,
        'indexes': ['id']
    }

    def __new__(cls, **kwargs):
        block = super().__new__(cls)
        block._block_meta = dict(cls._block_meta)
        return block

    def _form(self, data=None):
        form_cls = self._block_meta.get('manager_form', None) \
            or model_form(type(self))
        return form_cls(data, self)

    def render_template(self, **kwargs):
        template = self._block_meta.get('template')
        landing = landing_factory()
        try: return render_template(template, block=self, landing=landing)
        except: return ''

    def render_form(self):
        form = self._form()
        template = self._block_meta.get('manager_template', 
                                        'manager/partial/block.html')
        return render_template(template, form=form, block=self)

    def submit_form(self, data=None, commit=True):
        form = self._form(data)
        is_valid = form.validate()
        if is_valid:
            form.populate_obj(self)
            if commit: self.save()
        return is_valid, form.errors


class LandingModel(db.Document):
    blocks = db.EmbeddedDocumentListField(Block)


class SingletonLandingFactory:
    _singleton = None

    def __call__(self):
        cls = type(self)
        if cls._singleton is None:
            cls._singleton = LandingModel.objects.first()
        if cls._singleton is None:
            cls._singleton = LandingModel()
            cls._singleton.save()
        return cls._singleton


landing_factory = SingletonLandingFactory()