# iPhone / Android biometrics (WebAuthn passkeys)

Armonia uses **platform authenticators**: Face ID (iPhone), fingerprint / biometric unlock (Android), Touch ID / Windows Hello on desktop. Private keys stay on the device; the server stores only the public credential.

## Production env (required for real phones)

On Vercel (HTTPS):

```bash
PAIDIA_WEBAUTHN_ORIGIN=https://armonia-thassos.vercel.app
PAIDIA_WEBAUTHN_RP_ID=armonia-thassos.vercel.app
PAIDIA_WEBAUTHN_RP_NAME=Armonia Thassos
```

- Origin must match the URL users open (scheme + host, no path).
- RP ID = hostname only.
- HTTP / `file://` / wrong origin → Face ID fails; gate/Profil show a soft warning via `/api/auth/health` `passkeyOrigin`.

Local example: see `.env.example` (`http://127.0.0.1:5173` + `localhost`).

## User flow

1. First login with **PIN** (HTTPS).
2. Profil → **Face ID / Touch ID / Fingerabdruck einrichten** (or post-login hint).
3. Next visits: primary button on PIN screen = device biometrics; PIN is fallback.
4. Works in cold boot (`gate.js`) and in-app gate (`app.js`).

## Server

- Register options use **platform** authenticator, resident key preferred, UV required (`server.py`).
- Routes: `/api/auth/passkey/register|login/options|verify`, `/api/auth/passkey/remove`.
- Health: `passkeysAvailable`, `passkeyOrigin`, `passkeyRpId`.

## Code pointers

| Piece | Where |
|-------|--------|
| Cold-boot Face ID button | `gate.js` `renderPin` |
| In-app Face ID button | `app.js` `renderGatePin` |
| Register / labels | `app.js` `registerPasskey`, `biometricName` |
| Setup hint after PIN | `app.js` `maybePromptPasskeySetup` |
| Origin mismatch warn | `app.js` `paintWebauthnOriginWarn` |

## Safety

- Never log attestation blobs or request PIN in the same toast as secrets.
- Children and staff both may register passkeys for their profile.
- Removing passkeys requires an authenticated session.
