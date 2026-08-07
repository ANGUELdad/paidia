# Calendar & reminders

- `GET/POST /api/calendar/events` — admin create; child sees published only
- `GET /api/calendar/ics` — download .ics with VALARM
- `GET /api/calendar/google-link?eventId=` — Google Calendar template (no OAuth)
- `GET/POST/DELETE /api/calendar/reminders` — personal reminders
- Client: Notification API + SW `schedule-reminder`
