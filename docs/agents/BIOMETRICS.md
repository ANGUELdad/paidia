# iPhone / iPad / Android biometrics (WebAuthn platform authenticators)

Armonia uses Apple’s **Face ID / Touch ID for the web** (and Android fingerprints) via the WebAuthn **platform authenticator**. There is no separate Apple SDK for a PWA — Safari / Chrome call the Secure Enclave through `navigator.credentials`. Private keys never leave the device; the server stores only the public credential + an HttpOnly device cookie.

## Production env (required on real phones)

On Vercel (HTTPS):

```bash
PAIDIA_WEBAUTHN_ORIGIN=https://armonia-thassos.vercel.app
PAIDIA_WEBAUTHN_RP_ID=armonia-thassos.vercel.app
PAIDIA_WEBAUTHN_RP_NAME=Armonia Thassos
```

| Variable | Rule |
|----------|------|
| `PAIDIA_WEBAUTHN_ORIGIN` | Exact URL users open (scheme + host, **no** path / trailing slash) |
| `PAIDIA_WEBAUTHN_RP_ID` | Hostname only (must match the registrable domain) |
| `PAIDIA_WEBAUTHN_RP_NAME` | Shown in the Face ID / Touch ID sheet |

HTTP, `file://`, or wrong origin → Face ID fails. Gate / Profil show a soft warning via `/api/auth/health` `passkeyOrigin`.

Local: see `.env.example` (`http://127.0.0.1:5173` + `localhost`).

## Apple / WebKit checklist (v211+)

Per [WebKit — Meet Face ID and Touch ID for the Web](https://webkit.org/blog/11312/meet-face-id-and-touch-id-for-the-web/):

1. **Register** with `authenticatorSelection.authenticatorAttachment = "platform"` and `userVerification = "required"`.
2. **Login** `allowCredentials[].transports` must include `"internal"` so Safari does **not** ask for a security key.
3. Call `credentials.create` / `get` from a **user gesture** (button tap). Fetch inside that click is OK — WebKit propagates the gesture through `fetch`.
4. Persist credential IDs in an **HttpOnly Secure** cookie (`paidia_pk`) — not `document.cookie` (ITP caps those to ~7 days).
5. Labels: iPhone → Face ID · iPhone SE → Touch ID · iPad → Face ID / Touch ID · Mac → Touch ID · Android → Fingerprint.
6. Only show the biometrics button when `PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()` is true.
7. Works in Safari, Chrome on iOS (WKWebView), Home Screen PWA, iPad, and Android.

## User flow

1. First login with **PIN** on **HTTPS**.
2. Profil → **Face ID / Touch ID einrichten** (or post-login hint).
3. Next visits: primary button on PIN screen = device biometrics; PIN is fallback.
4. Cold boot (`gate.js`) and in-app gate (`app.js`) share the same ceremony.

## Server

- Routes: `/api/auth/passkey/register|login/options|verify`, `/api/auth/passkey/remove`
- Health: `passkeysAvailable`, `passkeyOrigin`, `passkeyRpId`, `passkeyRpName`
- Descriptors always send `transports: ["internal"]` for platform credentials

## Code pointers

| Piece | Where |
|-------|--------|
| Cold-boot Face ID button | `gate.js` `renderPin` / `finishPasskey` |
| In-app Face ID button | `app.js` `renderGatePin` / `loginWithPasskey` |
| Register / labels | `app.js` `registerPasskey`, `biometricName` |
| Setup hint after PIN | `app.js` `maybePromptPasskeySetup` |
| Origin mismatch warn | `app.js` `paintWebauthnOriginWarn` |
| Platform options | `server.py` `handle_passkey_*` |

## Safety

- Never log attestation blobs or mix PIN into biometrics toasts.
- Children and staff may both register passkeys for their profile.
- Removing passkeys requires an authenticated session.
- Apple’s platform authenticator often reports **sign count 0** — that is normal; do not treat it as a clone.
