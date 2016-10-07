import os
from werkzeug.utils import secure_filename
from werkzeug.security import (
    check_password_hash,
    generate_password_hash
)

from flask import current_app
from mongoengine import *
from landing.utility.blocks import BlockMetaclass, unregister_block


@unregister_block
class Block(Document, metaclass=BlockMetaclass):
    enabled = BooleanField(default=True)
    template = StringField(required=True)
    ordering = IntField()
    meta = {'allow_inheritance': True}


class Landing(Document):
    name = StringField()
    meta_info = DictField(default={})
    config = DictField(default={})

    @property
    def blocks(self):
        return Block.objects.order_by('ordering', 'id')


class Media(Document):
    file_path = StringField(required=True)
    mime_type = DictField()
    meta = {'indexes': ['file_path']}

    @property
    def file_url(self):
        media_root = current_app.config['MEDIA_ROOT']
        media_url = current_app.config.get('MEDIA_URL', '/static/media/')
        return self.file_path.replace(media_root, media_url, 1)

    # noinspection PyMethodOverriding
    def save(self, file_storage, media_path, *args, **kwargs):
        abs_path = os.path.abspath(
            os.path.join(media_path, secure_filename(file_storage.filename))
        )

        try: os.stat(media_path)
        except: os.mkdir(media_path)
        finally: file_storage.save(abs_path, 65536)

        self.file_path = abs_path
        self.mime_type = file_storage.mimetype_params
        return super().save(*args, **kwargs)

    def delete(self, **write_concern):
        try:
            os.remove(self.file_path)
        except OSError:
            pass
        super().delete(**write_concern)


USER_ROLES = (
    ('manager', 'Manager'),
    ('admin', 'Administrator')
)


class User(Document):
    name = StringField(required=True)
    email = EmailField(required=True, unique=True)
    role = StringField(required=True, choices=USER_ROLES)
    pw_hash = StringField()

    _hash_params = 'pbkdf2:sha224:10000'
    meta = {'indexes': ['email']}

    def set_password(self, password):
        self.pw_hash = generate_password_hash(password, self._hash_params)

    def check_password(self, password):
        return check_password_hash(self.pw_hash, password)
