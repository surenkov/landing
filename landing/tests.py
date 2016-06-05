import unittest
from landing import app


class Test_Blocks(unittest.TestCase):

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
