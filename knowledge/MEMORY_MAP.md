# Memory map

| Store | What |
|-------|------|
| `apps/api/.armonia-store.json` | Phase-0 durable file store |
| Prisma SQLite/Postgres | Target durable schema in `apps/web/prisma` |
| Cookies `armonia_session` | Auth session |
| localStorage (web) | lang, notif seen, widget draft |
| Passkeys | Platform authenticator (device-bound) |
| learningSignals | List/stock preference learning |
| xp | Kids rewards |
