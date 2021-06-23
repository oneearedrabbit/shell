import logging
import glob
import os
from fastapi import Request, FastAPI
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from sandbox.nsjail import NsJail, USERLAND_PATH, NSJAIL_SYSTEM_CFG
from sandbox.fs import userland_resolve

log = logging.getLogger(__name__)

nsjail = NsJail()  # run user applications
system_nsjail = NsJail(nsjail_config=NSJAIL_SYSTEM_CFG)  # run system commands

app = FastAPI()

origins = [os.environ.get("WEB_HOST", "0.0.0.0")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/fs")
async def getFiles(username: str = None, templatize: bool = False):
    if username is None:
        return {"body": {"message": "Unknown username"}}

    dst = userland_resolve(username)

    # TODO: this is a shortcut to pre-create projects, eventually
    # it'll become newProject endpoint
    cmd = ("/bin/mkdir", "-p", dst)
    system_nsjail.system(cmd)

    if templatize:
        tpl = "/userland_tpl/welcome/*"

        cmd = ("/bin/cp", "-pr", tpl, dst)
        # TODO: troubleshoot why nsjail doesn't copy files
        # system_nsjail.system(cmd)
        os.system(" ".join(cmd))

    files = [el for el in glob.iglob(f"{dst}/**/*", recursive=True)] or []
    files = [el.split(USERLAND_PATH)[1] for el in files]

    return {
        "files": files,
    }


@app.get("/fs/{filename:path}/raw", response_class=PlainTextResponse)
async def rawFile(filename: str):
    fullname = userland_resolve(filename)

    # TODO: nsjail call?
    with open(fullname) as f:
        content = f.read()

    return content


@app.post("/fs")
async def addFile(request: Request):
    params = await request.json()
    username = params.get("username")
    filename = params.get("filename")

    if username is None:
        return {"body": {"message": "Unknown username"}}

    if filename is None:
        return {"body": {"message": "Empty filename"}}

    fullname = userland_resolve(os.path.join(username, filename))

    cmd = ("/bin/touch", fullname)
    system_nsjail.system(cmd)

    return {"body": {"message": f"File {filename} created"}}


@app.delete("/fs")
async def delFile(request: Request):
    params = await request.json()
    filename = params.get("filename")

    if filename is None:
        return {"body": {"message": "Empty filename"}}

    fullname = userland_resolve(filename)

    cmd = ("/bin/rm", "-f", fullname)
    system_nsjail.system(cmd)

    return {"body": {"message": f"File {filename} deleted"}}


@app.post("/run")
async def eval(request: Request):
    params = await request.json()

    filename = params.get("filename")
    username = params.get("username")

    if filename is None:
        return {"stdout": "Empty filename", "returncode": 0}

    if username is None:
        return {"stdout": "Unknown username", "returncode": 0}

    try:
        result = nsjail.run(username=username, filename=filename)
    except Exception:
        log.exception(
            "An exception occurred while trying to process the request"
        )
        raise

    return {"stdout": result.stdout, "returncode": result.returncode}
