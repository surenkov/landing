import os
import json
import logging
from .templates import register_template

__all__ = ['load_all_blocks']
MANIFEST_FILE_NAME = 'manifest.json'


class CompilationError(Exception):
    pass


def _blocks_filter(dir_entry):
    block_manifest = os.path.join(dir_entry.path, MANIFEST_FILE_NAME)
    return dir_entry.is_dir() \
        and os.path.isfile(block_manifest)


def _compile_pyfile(file_path):
    try:
        return compile(open(file_path, 'r').read(), file_path, 'exec')
    except OSError:
        logging.exception('Cannot open "%s" for compilation.' % file_path)
    except SyntaxError:
        logging.exception('Cannot compile "%s" because of syntax error.'
                          % file_path)
    except ValueError: logging.exception('Cannot compile "%s".' % file_path)
    raise CompilationError()


def _load_block(manifest, directory):
    block_name = manifest['name']
    try:
        for template_name, path in manifest.get('templates', {}).items():
            register_template(
                block_name,
                template_name,
                os.path.join(directory, path)
            )

        compiled_asts = map(
            lambda f: _compile_pyfile(os.path.join(directory, f)),
            manifest.get('python_files', [])
        )
        for ast in compiled_asts:
            exec(ast)

    except CompilationError:
        logging.exception('Cannot compile block\'s "%s" .py files.')


def _load_manifest(block_path):
    try:
        return json.load(
            open(os.path.join(block_path, MANIFEST_FILE_NAME), 'r')
        ), block_path
    except OSError:
        logging.exception('Cannot load block "%s" because of system error.'
                          % block_path)
    except json.JSONDecodeError:
        logging.exception('Cannot load block "%s" because of JSON error.'
                          % block_path)
    return None, block_path


def load_all_blocks(blocks_dir):
    blocks = filter(_blocks_filter, os.scandir(blocks_dir))
    blocks_paths = map(lambda b: b.path, blocks)
    manifests = filter(
        lambda m: m[0] is not None and m[0].get('enabled', False),
        map(_load_manifest, blocks_paths)
    )
    for manifest, path in manifests:
        _load_block(manifest, path)
