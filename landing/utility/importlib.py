import os
import json
import logging
import threading

__all__ = ['load_all_blocks', 'block_local']
MANIFEST_FILE_NAME = 'manifest.json'
block_local = threading.local()


class CompilationError(Exception):
    pass


def _blocks_filter(dir_entry):
    block_manifest = os.path.join(dir_entry.path, MANIFEST_FILE_NAME)
    return dir_entry.is_dir() \
        and os.path.isfile(block_manifest)


def _load_block(directory):
    block_path = os.path.relpath(directory).split(os.sep)
    __import__('.'.join(block_path))


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


def load_all_blocks(blocks_module):
    blocks = filter(_blocks_filter, os.scandir(blocks_module))
    blocks_paths = map(lambda b: b.path, blocks)
    manifests = filter(
        lambda m: m[0] is not None and m[0].get('enabled', False),
        map(_load_manifest, blocks_paths)
    )
    for manifest, path in manifests:
        block_local.manifest = manifest
        block_local.path = path
        _load_block(path)
