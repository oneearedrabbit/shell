import logging
import os
from fastapi import Request, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sandbox.nsjail import NsJail

log = logging.getLogger(__name__)

app = FastAPI()

origins = [
    os.environ["WEB_HOST"]
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

nsjail = NsJail()

@app.post('/eval')
async def eval(request: Request):
    params = await request.json()

    filename = params['input']
    username = params['username']
    args = ()

    try:
        result = nsjail.run(filename, username, args=args)
    except Exception:
        log.exception("An exception occurred while trying to process the request")
        raise

    return {
        "stdout": result.stdout,
        "returncode": result.returncode
    }
