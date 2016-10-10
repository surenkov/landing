import os
import logging

from flask import render_template_string
from functools import partial
from .importlib import block_local

__all__ = [
    'template',
    'render_blocks',
    'render_block'
]
_template_registry = dict()


class TemplateNotFoundError(Exception):
    pass


def file_template(file_path):

    def render(**context):
        try:
            with open(file_path, 'r') as template_file:
                template_ = template_file.read()
        except OSError:
            template_ = ''
            logging.exception('Cannot load "%s" template.' % file_path)
        return render_template_string(template_, **context)

    return render


def cached_file_template(file_path):
    try:
        with open(file_path, 'r') as template_file:
            template_ = template_file.read()
    except OSError:
        template_ = ''
        logging.exception('Cannot load "%s" template.' % file_path)

    def render(**context):
        return render_template_string(template_, **context)

    return render


def template(template_path):
    return cached_file_template(
        os.path.join(block_local.path, template_path)
    )


def get_template_list(cls):
    templates = cls._meta.get('templates', {})
    return list(templates.keys())


def get_template_func(cls, name):
    templates = cls._meta.get('templates', {})
    return templates[name]


def render_block(block, landing):
    try:
        renderer = get_template_func(type(block), block.template)
        return renderer(block=block, landing=landing, render=render_block)
    except TemplateNotFoundError:
        logging.exception('Cannot render block %s: template not found' % block)
        return ''


def render_blocks(blocks, landing):
    return '\n'.join(map(partial(render_block, landing=landing), blocks))
