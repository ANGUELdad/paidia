---
tags: [audit, open]
---
# Protokoll

Append-only audit. Two stores:
- `DB.log` — client, inside the `ops` blob
- `security_events` — its own Postgres table, own rows

## Problem
`ops` measured **286 KB**. `DB.log` sits inside it and has **no retention**
anywhere in the codebase. Every entry rewrites the entire blob.

## Fix
1. `DB.log = DB.log.slice(-500)` in `logEntry()` — stops growth now
2. Move entries into `security_events`; retention becomes
   `DELETE WHERE ts < now() - interval '90 days'`
3. Export CSV/JSON before purge

Related: [[Datenmodell]], [[Schicht]]
