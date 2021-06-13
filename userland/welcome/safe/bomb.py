# this is a fork bomb, but it won't explode the system

import os
import time

def bomb(max):
    i = 0
    while i != max:
        os.fork()
        i+=1

while 1:
    bomb(50)
    break
