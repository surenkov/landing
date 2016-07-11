import os
from werkzeug.utils import secure_filename
from landing import app, db


class MediaFile(db.Document):
    url = db.StringField()
    path = db.StringField()
    meta = {
        'allow_inheritance': True,
        'indexes': ['url']
    }

    def delete(self, *args, **kwargs):
        if os.path.exists(self.path):
            os.remove(self.path)
        super().delete(*args, **kwargs)
            

class ImageFile(MediaFile):
    pass

class VideoFile(MediaFile): 
    pass


class MediaStorage:
    _media_types = {}

    def __init__(self, media_root=None, media_url=None):
        self.media_root = media_root or app.config.get('MEDIA_ROOT')
        self.media_url = media_url or app.config.get('MEDIA_URL')
        if not os.path.exists(self.media_root):
            os.mkdir(self.media_root)

    def save(self, file):
        if not hasattr(file, 'filename'):
            raise TypeError('File must be an instance of FileStorage.')

        file_name = secure_filename(file.filename)
        ext = os.path.splitext(file_name)[1][1:]
        type_ = None

        for ftype, exts in type(self)._media_types.items():
            if ext in exts:
                type_ = ftype
                break
        else:
            raise TypeError('This file extension is not allowed.')

        res = type_()
        res.save()

        res.path = os.path.join(self.media_root, str(res.id), file_name)
        res.url = '/%s/%s/%s' % (self.media_url.strip('/'), str(res.id),
                                 file_name)
        
        dir_name = os.path.dirname(res.path)
        if not os.path.exists(dir_name):
            os.mkdir(dir_name)
        file.save(res.path)
        res.save()
        return res

    def get(self, id):
        return MediaFile.objects.get(id=id)

    def by_url(self, url):
        return MediaFile.objects.get(url=url)

    def list(self):
        return MediaFile.objects.filter(url__startswith=self.media_url)

    @classmethod
    def register_type(cls, type_, extensions):
        cls._media_types[type_] = frozenset(extensions)


MediaStorage.register_type(ImageFile, ['jpg', 'jpeg', 'png', 'svg', 'webp'])
MediaStorage.register_type(VideoFile, ['ogg', 'ogv', 'mpg', 'mpeg',
                                       'mp4', 'webm'])