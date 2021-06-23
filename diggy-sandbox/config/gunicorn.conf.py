import os

workers = 2
bind = os.environ.get("HOST", "127.0.0.1") + ":8060"
logger_class = "sandbox.GunicornLogger"
access_logformat = "%(m)s %(U)s%(q)s %(s)s %(b)s %(L)ss"
access_logfile = "-"
chdir = "/sandbox"
worker_class = "uvicorn.workers.UvicornWorker"
