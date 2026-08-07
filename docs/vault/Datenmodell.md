---
tags: [architecture]
---
# Datenmodell

Durable state lives in `kv_store` (JSONB) plus `security_events`, in
Neon Postgres (`eu-central-1`). Locally the same schema runs on SQLite.

## Keys
- `auth_overrides` — auth overrides
- `auth_users` — auth users
- `gallery` — gallery
- `onboarding` — onboarding
- `ops` — ops
- `passkeys` — passkeys
- `security_state` — security
- `talk` — talk

## Known issue
`DB.log` is stored **inside** the `ops` blob, so every log write rewrites
the whole record. No pruning exists. See [[Protokoll]].

Related: [[API-Routen]], [[00 · Armonia Thassos]]
