# Auth domain map (TOKEN_REDUCE)

- PIN login → argon2 hash (upgrade on first login) → HttpOnly `armonia_session`
- Endpoints: `/api/auth/profiles`, `/login`, `/logout`, `/session`=`/me`, `/prefs`
- Modes: `staff` | `child`; admin flag gates notify/broadcast/templates
- Passkeys: RP ID/origin from env; `passkeysAvailable` false until webauthn lib wired
- Never dump full `store.py` — use this note + OpenAPI `/docs`
