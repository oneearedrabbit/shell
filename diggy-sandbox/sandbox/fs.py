import os
from pathlib import Path

from sandbox.env import USERLAND_PATH

def userland_resolve(target: str) -> str:
    return safe_resolve(USERLAND_PATH, target)

def safe_resolve(base: str, target: str) -> str:
    '''
    Force the target path to be relative to base path
    '''
    base_path = os.path.abspath(base)
    target_path = '.' + os.path.normpath(os.path.join('/', target))

    return str(Path(os.path.join(base_path, target_path)).resolve())
