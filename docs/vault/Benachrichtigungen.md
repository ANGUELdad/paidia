---
tags: [architecture, notifications, open]
---
# Benachrichtigungen

Full reminder taxonomy for Armonia Thassos.

## Channels

| channel | status | good for |
|---|---|---|
| in-app badge / toast | built | anything, while the app is open |
| WhatsApp | built (21 refs) | urgent, reaches people not in the app |
| email (Resend / SMTP) | built (25 refs) | digests, reports, anything with a link |
| **web push** | **missing** — see `WEB_PUSH_LATER.md` | time-critical reminders when the app is closed |

Web push is the gap. Everything marked *push* below currently has nowhere
to go except WhatsApp, which is too loud for routine reminders.

## Principles

1. **One channel per event.** Never push *and* WhatsApp the same thing.
2. **Quiet hours 22:00–07:00** except `security` and `coverage_gap`.
3. **Escalate, don't repeat.** Silent reminder → nudge → notify admin.
4. **Ends when acted on.** Every reminder has an explicit cancel condition.
5. **Per-profile opt-out** for everything except security.

---

## Schicht

| id | trigger | when | channel | to |
|---|---|---|---|---|
| `shift_soon` | shift starts in 30 min | T−30m | push | caregiver |
| `shift_not_started` | 10 min past start, no clock-in | T+10m | push → WhatsApp at T+20m | caregiver, then admin |
| `shift_end_soon` | 15 min before end | T−15m | push | caregiver |
| `shift_not_ended` | 20 min past end, still clocked in | T+20m | push | caregiver |
| `handover_missing` | ending without a note | on tap | in-app block | caregiver |
| `overtime` | >10 h in one shift | live | push + admin email | both |
| `weekly_hours` | >45 h in the week | Sun 18:00 | email | admin |

Cancels when: clock-in / clock-out / note saved.

## Vorrat

| id | trigger | when | channel | to |
|---|---|---|---|---|
| `stock_check_due` | shift ending, check not done | T−20m | push | caregiver |
| `stock_check_skipped` | shift ended, check skipped | on end | admin email | admin |
| `stock_variance` | count deviates from expected | on submit | in-app + admin digest | admin |
| `stock_empty` | item hits 0 | live | in-app | whoever is on |
| `stock_low_critical` | staple below threshold | daily 09:00 | push | on-shift caregiver |
| `expiry_soon` | dated item within 3 days | daily 09:00 | in-app | on-shift caregiver |

## Einkauf

| id | trigger | when | channel | to |
|---|---|---|---|---|
| `friday_list_empty` | Friday list still empty | Thu 18:00 | push | admin |
| `friday_reminder` | shopping day | Fri 09:00 | push | assigned caregiver |
| `trip_incomplete` | started, not confirmed after 3 h | T+3h | push | same caregiver |
| `items_missing` | trip closed with shortages | on confirm | in-app + carried to next list | admin |

## Plan

| id | trigger | when | channel | to |
|---|---|---|---|---|
| `tomorrow_preview` | tomorrow's assignments | 20:00 | push | each caregiver |
| `plan_changed` | your shift was edited | on save | push | affected caregiver |
| `coverage_gap` | a block has nobody | on save + daily 07:00 | WhatsApp | admin — **ignores quiet hours** |
| `solo_with_children` | 1 adult, ≥3 children | on save | in-app warning | admin |
| `event_tomorrow` | event within 24 h | 18:00 | push | caregivers + parents |

## Sicherheit

Never silenced, never opt-out.

| id | trigger | channel | to |
|---|---|---|---|
| `new_device_login` | unknown device | push + email | that profile |
| `pin_changed` | PIN changed | email | profile + admin |
| `failed_attempts` | 5 failures in window | email | admin |
| `passkey_added` | new passkey registered | email | profile |

## Kinder

Gentle, never punitive.

| id | trigger | when | channel |
|---|---|---|---|
| `child_today` | today's activities | 07:30 | in-app |
| `child_event` | event tomorrow | 17:00 | in-app |
| `child_streak` | came back N days running | on open | in-app reward |

## System / Admin

| id | trigger | when | channel |
|---|---|---|---|
| `weekly_digest` | week summary — hours, variance, gaps | Sun 18:00 | email |
| `storage_growing` | `ops` blob over threshold | weekly | in-app — see [[Protokoll]] |
| `db_unreachable` | health check fails | live | email |
| `drive_upload_failed` | photo fell back to inline | live | in-app |

---

## Build order

1. **Web push** — VAPID, `PushManager.subscribe`, store in `db.py`,
   `POST /api/push/subscribe`. Nothing above marked *push* works without it.
2. **Scheduler** — the app has no cron. Vercel Cron hitting a
   `/api/notify/tick` endpoint is the cheapest route.
3. **Preference table** — per-profile, per-id opt-out.
4. Then the notifications themselves, cheapest first: `shift_soon`,
   `stock_check_due`, `friday_reminder`.

Related: [[Schicht]], [[Vorrat]], [[Plan]], [[Sicherheit]], [[Kinder]], [[Protokoll]]
