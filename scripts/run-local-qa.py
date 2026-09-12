"""Launch against an isolated SQLite database and existing disposable auth fixture.

Never reads the project's .env. Requires docs/marketing/.local-auth/marketing.env.
Use with scripts/qa-domain-workflows.mjs and qa-operation-workspace.mjs.
"""
import builtins
import io
import os
from pathlib import Path
import runpy
import sys

ROOT=Path(__file__).resolve().parents[1]
FIXTURE=ROOT/'docs/marketing/.local-auth/marketing.env'
DATABASE=ROOT/'docs/marketing/.local-auth/workspace-qa.sqlite'
if not FIXTURE.exists():
    raise SystemExit('Disposable auth fixture missing; do not use production credentials.')

def database_setting(key):
    return any(part in key for part in ('DATABASE_URL','POSTGRES','SQLITE','KV_REST','UPSTASH_REDIS','VERCEL'))

lines=[]
for line in FIXTURE.read_text().splitlines():
    key,sep,value=line.partition('=')
    if sep and not key.strip().startswith('#') and not database_setting(key):
        lines.append(line)
lines.extend([
    'PAIDIA_DATABASE_URL=sqlite:///'+str(DATABASE),
    'PAIDIA_SQLITE_PATH='+str(DATABASE),
    'PAIDIA_HOST=127.0.0.1',
    'PAIDIA_PORT=5173',
])
fixture_text='\n'.join(lines)+'\n'
for key in list(os.environ):
    if database_setting(key):os.environ.pop(key,None)
for line in lines:
    key,_,value=line.partition('=')
    os.environ[key.strip()]=value.strip().strip('"').strip("'")
original_open=builtins.open

def isolated_open(file,*args,**kwargs):
    if isinstance(file,(str,bytes,os.PathLike)) and Path(file).name=='.env':
        return io.StringIO(fixture_text)
    return original_open(file,*args,**kwargs)

builtins.open=isolated_open
os.chdir(ROOT)
sys.path.insert(0,str(ROOT))
runpy.run_path(str(ROOT/'server.py'),run_name='__main__')
