import os
import hashlib

from mongoengine import *
from wtforms.validators import email
from werkzeug.security import (
    check_password_hash,
    generate_password_hash,
    safe_join
)

from .block_registry import BlockMetaclass, unregister_block


@unregister_block
class Block(Document, metaclass=BlockMetaclass):
    enabled = BooleanField(default=True)


class Landing(Document):
    name = StringField(required=True)
    meta_info = DictField(default={})
    blocks = ListField(ReferenceField(Block, reverse_delete_rule=PULL))


class Media(Document):
    file_hash = StringField(required=True)
    ext = StringField(required=True)
    mime_type = DictField()

    meta = {
        'indexes': [
            ('file_hash', 'ext')
        ]
    }

    def base_path(self):
        _hash = self.file_hash
        p1, p2, rest = _hash[:2], _hash[2:2], _hash[4:]
        return os.path.join(p1, p2, rest + self.ext)

    def abs_path(self):
        from flask import current_app
        media_root = current_app.config['MEDIA_ROOT']
        return safe_join(media_root, self.base_path())

    def _save_file(self, file_storage, buff_size):
        abs_path = self.abs_path()
        dir_name = os.path.dirname(abs_path)
        if not os.path.exists(dir_name):
            os.mkdir(dir_name)
        file_storage.save(abs_path, buff_size)

    # noinspection PyMethodOverriding
    def save(self, file_storage, *args, **kwargs):
        """
        Represents media file in database
        :param file_storage: werkzeug.datastructures.FileStorage
        :return: mongoengine.Document.save() result
        """
        from flask import current_app

        buff_size = current_app.config['MEDIA_BUFF_SIZE'] or 65536  # 64 Kb
        file_hash = hashlib.sha1()

        data = file_storage.read(buff_size)
        while data:
            file_hash.update(data)
            data = file_storage.read(buff_size)

        _, ext = os.path.splitext(file_storage.filename)
        self.mime_type = file_storage.mimetype_params
        self.file_hash = file_hash.hexdigest()
        self.ext = ext

        self._save_file(file_storage, buff_size)
        return super().save(*args, **kwargs)

    def delete(self, **write_concern):
        from flask import current_app

        file_hash = self.file_hash
        dir1, dir2 = file_hash[:2], file_hash[2:2]
        media_root = current_app.config['MEDIA_ROOT']
        try:
            os.remove(self.abs_path())
            os.rmdir(os.path.join(media_root, dir1, dir2))
            os.rmdir(os.path.join(media_root, dir1))
        except OSError:
            pass
        super().delete(**write_concern)


USER_ROLES = (
    ('manager', 'Manager'),
    ('admin', 'Administrator')
)


class User(Document):
    name = StringField(required=True)
    email = StringField(required=True, unique=True, regex=email())
    role = StringField(required=True, choices=USER_ROLES)
    pw_hash = StringField()

    _hash_params = 'pbkdf2:sha224:1000'
    meta = {
        'indexes': ['email']
    }

    def set_password(self, password):
        self.pw_hash = generate_password_hash(password, self._hash_params)

    def check_password(self, password):
        return check_password_hash(self.pw_hash, password)
