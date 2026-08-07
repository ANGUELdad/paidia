# Platform parity checklist (v69 oracle → Armonia v2)

Cutover is green when every row is ✅ on production data clone.

## Auth & shell
- [ ] Staff / child dual login
- [ ] PIN argon2 verify + session cookie
- [ ] Profile prefs (nickname/emoji/color/lang/widgets)
- [ ] Biometrics path documented (HTTPS origin); register after PIN
- [ ] Login version/changelog chip

## Ops
- [ ] Week matrix with full dates (desktop grid + mobile stack)
- [ ] Double-book validation + override reason
- [ ] Stock adjust + stock-check ritual
- [ ] Shop list + Friday reminders + learning suggestions (confirm only)
- [ ] Book journal append/rewrite + audit filters
- [ ] Presence Ich bin da / late why

## Comms & AI
- [ ] Talk topics + messages
- [ ] Meeting notes by ISO week key + reminder
- [ ] Zo-Ai offline/Omni/Groq with variety seed
- [ ] Structured actions Confirm (+ PIN for schedule/broadcast)
- [ ] Voice (Web Speech) on Zo-Ai
- [ ] Admin broadcast email/push/banner preview

## Notifications
- [ ] Rules for all 9 kinds toggleable in admin UI
- [ ] Evaluate due list (local)
- [ ] Web Push subscribe SW + VAPID when keys set
- [ ] Dedupe keys on due items

## Experience
- [ ] Home widgets reorder persisted
- [ ] Kids XP/streak/badges + games
- [ ] Child never sees staff ops dock
- [ ] Knowledge vault + TOKEN_REDUCE usable by agents

## Hardening
- [ ] API pytest green
- [ ] migrate_ops_to_prisma.py dry-run on clone
- [ ] Legacy PWA frozen under legacy/ (or LEGACY.md) until cutover
- [ ] Conflict/revision awareness on stock snapshot
