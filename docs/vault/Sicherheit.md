---
tags: [domain, security]
---
# Sicherheit

- PIN per profile, bcrypt-hashed, rate limited
- Passkeys / WebAuthn — ~100 references in `server.py`
- Signed session cookie, 30d
- `security_events` records logins, PIN changes, failures

Related: [[Datenmodell]], [[Protokoll]]
