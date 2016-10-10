from landing.models import *
from landing.utility.templates import template

from manager.utility.fields import *
from manager.utility.parsers import block_parser


def review_entry(entry):
    picture_id = entry['picture'].get('id', None)
    picture = Media.objects.filter(id=picture_id).first() \
        if picture_id is not None else None
    return ReviewEntry(
        name=entry.get('name'),
        review=entry.get('review'),
        picture=picture
    )


reviews_parser = block_parser.copy()
reviews_parser.add_argument('title', type=str)
reviews_parser.add_argument('reviews', type=review_entry, action='append')

reviews_serializer = block_fields.copy()
reviews_serializer.update({
    'title': String,
    'reviews': List(Nested({
        'name': String,
        'review': String,
        'picture': Nested(media_fields)
    }))
})


class ReviewEntry(EmbeddedDocument):
    name = StringField()
    review = StringField()
    picture = ReferenceField(Media)


class ReviewsBlock(Block):
    title = StringField(default='')
    reviews = EmbeddedDocumentListField(ReviewEntry)

    meta = {
        'templates': {
            'default': template('template.html'),
        },
        'parser': reviews_parser,
        'serializer': reviews_serializer,
        'verbose_name': 'Отзывы'
    }
