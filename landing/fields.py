from wtforms.fields import *
from landing import app


class UploadMediaFileField(FileField):
    
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
            setattr(obj, name, path.join(app.config['MEDIA_URL'], uploaded_name))

