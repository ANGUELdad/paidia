# Platform parity checklist (v69 oracle → Armonia v2)

Cutover is green when every row is ✅ on production data clone.

## Auth & shell
- [x] Staff / child dual login
- [x] PIN argon2 verify + session cookie
- [x] Profile prefs (nickname/emoji/color/lang/widgets)
- [x] Biometrics path documented (HTTPS origin); register after PIN *(Profile register/remove + Login Passkey CTA; needs WEBAUTHN_ORIGIN)*
- [x] Login version/changelog chip
- [x] PIN reset request/confirm (email, no enumeration)

## Ops
- [x] Week matrix with full dates (desktop grid + mobile stack)
- [x] Double-book validation + override reason
- [x] Stock adjust + stock-check ritual
- [x] Shop list + Friday reminders + learning suggestions (confirm only) *(+ reorder + OCR text + Friday + Im Supermarkt)*
- [x] Book journal append/rewrite + audit filters
- [x] Presence Ich bin da / late why *(in-app late sheet)*
- [x] Coverage board `/coverage`
- [x] Incident log `/incidents`
- [x] Child care log `/care`

## Comms & AI
- [x] Talk topics + messages
- [x] Meeting notes by ISO week key + reminder
- [x] Zo-Ai offline/Omni/Groq with variety seed
- [x] Structured actions Confirm (+ PIN for schedule/broadcast) *(human action cards)*
- [x] Voice (Web Speech) on Zo-Ai
- [x] Admin broadcast email/push/banner preview *(email when Resend/SMTP configured)*

## Notifications
- [x] Rules for all 9 kinds toggleable in admin UI
- [x] Evaluate due list (local)
- [x] Web Push subscribe SW + VAPID when keys set
- [x] Dedupe keys on due items
- [x] ICS subscribe feed token

## Experience
- [x] Home shift command center + urgency + Mehr IA
- [x] Kids XP/streak/badges + real Memory/Quiz/Calm games + mood
- [x] Child never sees staff ops dock
- [x] Knowledge vault + TOKEN_REDUCE usable by agents
- [x] Shared i18n DE/EL layer (`apps/web/src/lib/i18n.ts`)

## Hardening
- [x] API pytest green
- [ ] migrate_ops_to_prisma.py dry-run on clone
- [x] Legacy PWA frozen under LEGACY.md until cutover
- [ ] Conflict/revision awareness on stock snapshot
