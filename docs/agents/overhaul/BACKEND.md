# Backend notes — overhaul

Audit did not surface auth/ops 5xx on happy path (local QA harness).

## Relevant surfaces

| Area | File | Notes |
|------|------|-------|
| Auth login | `server.py` `/api/auth/login` | Suite uses disposable `pins.json` via `run_server.py` |
| Ops sync | `/api/ops` | Keys include school: `schoolMaterials`, `schoolMaterialMedia`, `schoolActivity` |
| Caps | `OPS_LIST_CAPS` in `server.py` | Cap school lists like other school keys |
| Gallery media | `/api/gallery` | School photos prefer compressed path, not giant ops base64 |
| Vercel | `api/index.py` | Imports paidia helpers — no separate OPS_KEYS copy |

## QA auth

- Plain `python3 server.py` ≠ disposable pins
- Always: `python3 docs/marketing/.local-auth/run_server.py`

## No backend change in v182

Frontend/CSS/suite only. Revisit if future suite catches ops write failures on materials photo upload.
