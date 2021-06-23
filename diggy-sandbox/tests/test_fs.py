import os
from pathlib import PosixPath

from sandbox.fs import safe_resolve

def test_safe_resolve():
    path = os.path.abspath('.')

    assert safe_resolve('../test') == PosixPath(f'{path}/test')
    assert safe_resolve('../../test') == PosixPath(f'{path}/test')
    assert safe_resolve('../../abc/../test') == PosixPath(f'{path}/test')
    assert safe_resolve('../../abc/../test/fixtures') == PosixPath(f'{path}/test/fixtures')
    assert safe_resolve('../../abc/../.test/fixtures') == PosixPath(f'{path}/.test/fixtures')
    assert safe_resolve('/test/foo') == PosixPath(f'{path}/test/foo')
    assert safe_resolve('./test/bar') == PosixPath(f'{path}/test/bar')
    assert safe_resolve('.test/baz') == PosixPath(f'{path}/.test/baz')
    assert safe_resolve('qux') == PosixPath(f'{path}/qux')
    assert safe_resolve('../test', '..') == PosixPath(f'{path}/../test').resolve()
    assert safe_resolve('81039b9d-028d-404c-bb0b-adbe84870177', '/userland') == PosixPath(f'/userland/81039b9d-028d-404c-bb0b-adbe84870177')
