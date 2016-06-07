import os
import unittest


class Test_Blocks(unittest.TestCase):

    def setUp(self):
        from os import path, mkdir
        from tempfile import mkdtemp

        self.blocks_dir = mkdtemp()
        self.blocks_count = 10
        for i in range(self.blocks_count):
            bd = path.join(self.blocks_dir, 'block%d' % i)
            mkdir(bd)
            with open(path.join(bd, 'block.py'), 'w+') as f:
                f.write("from landing.models import Block\n"
                        "class Block%d(Block): pass\n" % i)

    def tearDown(self):
        import shutil
        shutil.rmtree(self.blocks_dir, True)

    def test__load_blocks(self):
        import tempfile
        from landing.blocks import load_blocks, registered_blocks
        load_blocks(self.blocks_dir)

        def contains(b):
            return b._class_name == 'Block%d' % i

        for i in range(self.blocks_count):
            self.assertTrue(any(map(contains, registered_blocks())))
        self.assertRaises(FileNotFoundError, lambda:
                          load_blocks(next(tempfile._get_candidate_names())))

    def test__register_blocks(self):
        from landing.models import Block
        from landing.blocks import registered_blocks
        class _A(Block): pass
        class _B(Block): pass
        class _C: pass

        self.assertIn(_A, registered_blocks())
        self.assertIn(_B, registered_blocks())
        self.assertNotIn(_C, registered_blocks())


class Test_Langing(unittest.TestCase):
    pass

if __name__ == '__main__':
    unittest.main()
