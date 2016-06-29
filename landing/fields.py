from wtforms.fields import *
from landing import app


class MediaFileField(StringField):

    def populate_obj(self, obj, name):
        from os import path, makedirs
        from werkzeug.utils import secure_filename
        from werkzeug.datastructures import FileStorage

        id = str(obj.id)
        value = self.data
        if not isinstance(value, FileStorage): return
        filename = secure_filename(value.filename)

        if filename != '':
            upload_path = path.join(app.config['MEDIA_ROOT'], id)
            if not path.exists(upload_path):
                makedirs(upload_path)
            uploaded_name = '%s/%s' % (id, filename)

            value.save(path.join(app.config['MEDIA_ROOT'], uploaded_name))
            setattr(obj, name, path.join(app.config['MEDIA_URL'], 
                                         uploaded_name))


class TypedFieldList(FieldList):

    def __init__(self, _type, *args, **kwargs):
        self._type = _type
        return super().__init__(*args, **kwargs)

    def populate_obj(self, obj, name):
        _fake = type(str('_fake'), (), {})
        output = []
        for field in self.entries:
            fake_obj = _fake()
            fake_obj.data = self._type()
            field.populate_obj(fake_obj, 'data')
            output.append(fake_obj.data)

        setattr(obj, name, output)
