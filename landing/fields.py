from wtforms.fields import *
from wtforms.widgets import TextInput, HTMLString, html_params


class PlaceholderWidget:
    default_element = 'div'

    def __init__(self, default_element=None):
        if default_element is not None:
            self.default_element = default_element

    def __call__(self, field, **kwargs):
        kwargs.setdefault('id', field.id)
        params = html_params(class_=field.name, **kwargs)
        return HTMLString('<{0} {1}></{0}>'.format(self.default_element,
                                                   params))


class MediaFileInput(TextInput):
    input_type = 'text'

    def __call__(self, field, **kwargs):
        kwargs.setdefault('id', field.id)
        kwargs.setdefault('type', self.input_type)
        kwargs['name'] = field.name
        return HTMLString(
            '<div class="input-group">' +
            ('<input class="input-group-field" %s>' % self.html_params(**kwargs)) +
                '<div class="input-group-button">' +
                    '<button type="button" class="media-open secondary button" title="Выбрать файл">' +
                        '<i class="fi-photo"></i>' +
                    '</button>' +
                '</div>' +
            '</div>')


class MediaFileField(StringField):
    widget = MediaFileInput()


class TypedFieldList(FieldList):

    def __init__(self, _type, *args, **kwargs):
        self._type = _type
        super().__init__(*args, **kwargs)

    def populate_obj(self, obj, name):
        _fake = type(str('_fake'), (), {})
        output = []
        for field in self.entries:
            fake_obj = _fake()
            fake_obj.data = self._type()
            field.populate_obj(fake_obj, 'data')
            output.append(fake_obj.data)

        setattr(obj, name, output)
