import os
from importlib.util import spec_from_file_location, module_from_spec
from mongoengine.base import DocumentMetaclass
from landing import app, db


app.registered_blocks = set()

class BlockType(DocumentMetaclass):

    def __new__(cls, name, bases, attrs):
        new_cls = super().__new__(cls, name, bases, attrs)
        app.registered_blocks.add(new_cls)
        return new_cls


class Block(db.EmbeddedDocument, metaclass=BlockType):
    """ Base class for all landing blocks """
    meta = {
        'abstract': True,
        'allow_inheritance': True
    }


def load_blocks(path, base_filename='block.py'):
    block_dirs = [(p, d) for p, d in 
                    [(os.path.join(path, d, base_filename), d) 
                     for d in os.listdir(path)] 
                  if os.path.exists(p)]
    for bpath, bname in block_dirs:
        spec = spec_from_file_location('%s.%s' % (__name__, bname), bpath)
        module = module_from_spec(spec)
        spec.loader.exec_module(module)


load_blocks(app.config.get('BLOCKS_DIR', 
                           os.path.join(os.path.dirname(__file__), 'blocks')))
app.registered_blocks.remove(Block)