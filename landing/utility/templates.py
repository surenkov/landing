import logging
from flask import render_template_string
from landing.models import Block, Landing
from functools import partial

__all__ = [
    'register_template',
    'set_templates',
    'get_template_func',
    'render_blocks',
    'render_block'
]
_template_registry = dict()
_cls_registry = dict()


class TemplateNotFoundError(Exception):
    pass


def file_template(file_path):

    def render(**context):
        try:
            with open(file_path, 'r') as template_file:
                template = template_file.read()
        except OSError:
            template = ''
            logging.exception('Cannot load "%s" template.' % file_path)
        return render_template_string(template, **context)

    return render


def cached_file_template(file_path):
    try:
        with open(file_path, 'r') as template_file:
            template = template_file.read()
    except OSError:
        template = ''
        logging.exception('Cannot load "%s" template.' % file_path)

    def render(**context):
        return render_template_string(template, **context)

    return render


def register_template(block, name, path):
    _template_registry.setdefault(block, {})
    _template_registry[block][name] = cached_file_template(path)


def set_templates(block, templates):
    if block not in _template_registry:
        logging.warning('There is no templates for block "%s"' % block)
    else:
        not_found_templates = [t for t in templates
                               if t not in _template_registry[block]]
        if not_found_templates:
            logging.warning('Template(s) [%s] ain\'t exist in block "%s"'
                            % (', '.join(not_found_templates), block))

    def wrapper(cls):
        _cls_registry[cls] = (block, set(templates))
        return cls

    return wrapper


def get_template_list(cls):
    return list(_cls_registry[cls][1])


def get_template_func(cls, name):
    block, templates = _cls_registry[cls]
    if name not in templates:
        raise TemplateNotFoundError('Template "%s" not found for block "%s".'
                                    % (name, block))
    return _template_registry[block][name]


def render_block(block: Block, landing: Landing):
    try:
        renderer = get_template_func(type(block), block.template)
        return renderer(block=block, landing=landing, render=render_block)
    except TemplateNotFoundError:
        logging.exception('Cannot render block %s: template not found' % block)
        return ''


def render_blocks(blocks: list, landing: Landing):
    return ''.join(map(partial(render_block, landing=landing), blocks))
