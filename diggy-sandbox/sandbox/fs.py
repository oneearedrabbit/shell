import os
from pathlib import Path

def safe_resolve(target: str, base: str = '.') -> Path:
    '''
    Force the target path to be relative to base path
    '''
    target_path = '.' + os.path.normpath(os.path.join('/', target))
    base_path = os.path.abspath(base)

    return Path(os.path.join(base_path, target_path)).resolve()
