from landing import app, db
from landing.blocks import Block


class LandingQuerySet(db.QuerySet):

    """ QuerySet for singleton landing instance. """
    
    def create(self, **kwargs):
        return self.first() or super().create(**kwargs)

    def delete(self, explicit=False, *args, **kwargs):
        if not explicit:
            raise NotImplementedError()
        return super().delete(*args, **kwargs)

    def insert(self, doc, *args, **kwargs):
        if self.count() > 0 or len(doc) > 1:
            raise db.MultipleObjectsReturned()
        return super().insert(doc, *args, **kwargs)


class Landing(db.Document):

    """ Singleton landing instance. """

    blocks = db.EmbeddedDocumentListField(Block)
    meta = {
        'max_documents': 1,
        'queryset_class': LandingQuerySet
    }

    def __new__(cls, *args, **kwargs):
        rv = cls.objects.first() or super().__new__(*args, **kwargs)
        return rv

    def delete(self, explicit=False, *args, **kwargs):
        if not explicit:
            raise NotImplementedError()
        super().delete(*args, **kwargs)
