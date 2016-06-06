import unittest
from landing import app


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
                f.write("from landing.blocks import Block\n"
                        "class Block%d(Block): pass\n" % i)


    def tearDown(self):
        import shutil
        shutil.rmtree(self.blocks_dir, True)


    def test__load_blocks(self):
        import tempfile
        from landing.blocks import load_blocks
        load_blocks(self.blocks_dir)
        for i in range(self.blocks_count):
            def contains(b):
                return b._class_name == 'Block%d' % i
            self.assertTrue(lambda: any(map(contains, app.registered_blocks)),
                            'blocks folder does not contain Block%d' % i)
        self.assertRaises(FileNotFoundError, lambda: 
                          load_blocks(next(tempfile._get_candidate_names())))


    def test__register_blocks(self):
        from landing.blocks import Block
        class _A(Block): pass
        class _B(Block): pass
        class _C: pass

        self.assertIn(_A, app.registered_blocks)
        self.assertIn(_B, app.registered_blocks)
        self.assertNotIn(_C, app.registered_blocks)


if __name__ == '__main__':
    unittest.main()
