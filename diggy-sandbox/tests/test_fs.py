import os
from pathlib import PosixPath

from sandbox.fs import safe_resolve

def test_safe_resolve():
    path = os.path.abspath('.')

    assert safe_resolve(path, '../test') == f'{path}/test'
    assert safe_resolve(path, '../../test') == f'{path}/test'
    assert safe_resolve(path, '../../abc/../test') == f'{path}/test'
    assert safe_resolve(path, '../../abc/../test/fixtures') == f'{path}/test/fixtures'
    assert safe_resolve(path, '../../abc/../.test/fixtures') == f'{path}/.test/fixtures'
    assert safe_resolve(path, '/test/foo') == f'{path}/test/foo'
    assert safe_resolve(path, './test/bar') == f'{path}/test/bar'
    assert safe_resolve(path, '.test/baz') == f'{path}/.test/baz'
    assert safe_resolve(path, 'qux') == f'{path}/qux'
    assert safe_resolve('..', '../test') == str(PosixPath(f'{path}/../test').resolve())
    assert safe_resolve('/userland', '81039b9d-028d-404c-bb0b-adbe84870177') == '/userland/81039b9d-028d-404c-bb0b-adbe84870177'
