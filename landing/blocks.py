import os
from importlib.util import spec_from_file_location, module_from_spec


__block_registry = set()

def register_block(block):
    __block_registry.add(block)
    return block

def unregister_block(block):
    __block_registry.discard(block)
    return block

def registered_blocks():
    return set(__block_registry)

def load_blocks(path, base_filename='block.py'):
    block_dirs = [(p, d) for p, d in 
                    [(os.path.join(path, d, base_filename), d) 
                     for d in os.listdir(path)] 
                  if os.path.exists(p)]
    for bpath, bname in block_dirs:
        spec = spec_from_file_location('%s.%s' % (__name__, bname), bpath)
        module = module_from_spec(spec)
        spec.loader.exec_module(module)
