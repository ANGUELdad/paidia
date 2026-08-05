# Zo-Ai knowledge map

Index of curated help for the in-app assistant **Zo-Ai**. Files are loaded into server prompts by role (token-capped).

| Topic | Child | Staff | Admin | File |
|-------|:-----:|:-----:|:-----:|------|
| App overview, houses, language | x | x | x | [overview.md](overview.md) |
| Child portal (today / week / events / games) | x | | | [child.md](child.md) |
| Day-to-day ops (Home, Plan, Lager, Liste, Buch, Talk) | | x | x | [staff.md](staff.md) |
| Admin center, permanent plan, shifts, contacts | | | x | [admin.md](admin.md) |
| Structured draft actions (`paidia-action`) | | x | x | [actions.md](actions.md) |
| Safety, limits, what Zo-Ai never does | x | x | x | [safety.md](safety.md) |

## Injection rules (server)

- **child** → `overview` (short) + `child` + `safety`
- **staff** → `overview` (short) + `staff` + `actions` + `safety`
- **admin** → `overview` (short) + `staff` + `admin` + `actions` + `safety`
- Cap ~6–8k characters total per role.

## Product vs coding agents

- **Zo-Ai** (runtime): these files via `server.py`.
- **Claude Code** (developers): see root `CLAUDE.md` and `docs/claude-code-setup.md` — same facts, different audience.
