"use client";

import { FormEvent, useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell, Grid } from "@/components/PageShell";
import { api } from "@/lib/api";
import { scheduleLocalReminder } from "@/lib/reminders";

type EventRow = {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  status: string;
  audience: string;
  notes?: string;
};

type Reminder = { id: string; title: string; at: string; url: string };

export default function CalendarPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [calendarDue, setCalendarDue] = useState<Reminder[]>([]);
  const [admin, setAdmin] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("");
  const [rmTitle, setRmTitle] = useState("");
  const [rmAt, setRmAt] = useState("");

  async function load() {
    const s = await api<{ authenticated: boolean; admin?: boolean; mode?: string }>("/api/auth/session");
    if (!s.authenticated) {
      window.location.href = "/";
      return;
    }
    if (s.mode === "child") {
      window.location.href = "/kids";
      return;
    }
    setAdmin(!!s.admin);
    const e = await api<{ events: EventRow[] }>("/api/calendar/events");
    setEvents(e.events || []);
    const r = await api<{ reminders: Reminder[]; calendar: Reminder[] }>("/api/calendar/reminders");
    setReminders(r.reminders || []);
    setCalendarDue(r.calendar || []);
  }

  useEffect(() => {
    load().catch(() => {
      window.location.href = "/";
    });
  }, []);

  async function createEvent(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await api("/api/calendar/events", {
      method: "POST",
      body: JSON.stringify({
        title,
        date,
        startTime: "10:00",
        endTime: "12:00",
        audience: "all",
        status: "published",
        remindMinutes: [60, 15],
      }),
    });
    setTitle("");
    setStatus("Event gespeichert");
    await load();
  }

  async function addToGoogle(id: string) {
    const r = await api<{ url: string }>(`/api/calendar/google-link?eventId=${id}`);
    window.open(r.url, "_blank", "noopener,noreferrer");
  }

  function downloadIcs(id?: string) {
    const q = id ? `?eventId=${id}` : "";
    window.location.href = `/api/calendar/ics${q}`;
  }

  async function addReminder(e: FormEvent) {
    e.preventDefault();
    if (!rmTitle.trim() || !rmAt) return;
    const r = await api<{ reminder: Reminder }>("/api/calendar/reminders", {
      method: "POST",
      body: JSON.stringify({ title: rmTitle, at: rmAt, url: "/calendar" }),
    });
    await scheduleLocalReminder(r.reminder.title, r.reminder.at, "/calendar");
    setRmTitle("");
    setStatus("Erinnerung gesetzt (OS + App)");
    await load();
  }

  return (
    <>
      <PageShell
        eyebrow="Kalender"
        title="Termine & Erinnerungen"
        lead="ICS, Google Calendar, lokale Reminder — alles bestätigbar."
        actions={
          <button type="button" className="btn-sec !min-h-10 text-sm" onClick={() => downloadIcs()} data-testid="ics-all">
            ICS alle
          </button>
        }
      >
        {status && <p className="panel muted">{status}</p>}

        <section className="panel stack">
          <h2>Kommende Events</h2>
          <Grid>
            {events.map((ev) => (
              <article key={ev.id} className="tile" data-testid={`event-${ev.id}`}>
                <div className="tile-main">
                  <strong>{ev.title}</strong>
                  <p className="muted">
                    {ev.date} · {ev.startTime || "—"}–{ev.endTime || "—"} · {ev.status} · {ev.audience}
                  </p>
                </div>
                <div className="tile-actions">
                  <button type="button" className="btn ghost" onClick={() => downloadIcs(ev.id)}>
                    ICS
                  </button>
                  <button type="button" className="btn-sec" onClick={() => addToGoogle(ev.id)}>
                    Google
                  </button>
                </div>
              </article>
            ))}
            {!events.length && <p className="muted">Keine Events.</p>}
          </Grid>
        </section>

        {admin && (
          <section className="panel stack">
            <h2>Event anlegen</h2>
            <form className="stack" onSubmit={createEvent}>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel" data-testid="event-title" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <button className="btn" type="submit" data-testid="event-save">
                Veröffentlichen
              </button>
            </form>
          </section>
        )}

        <section className="panel stack">
          <h2>Persönliche Erinnerungen</h2>
          <form className="stack" onSubmit={addReminder}>
            <input value={rmTitle} onChange={(e) => setRmTitle(e.target.value)} placeholder="z.B. Freitagsliste" data-testid="rm-title" />
            <input type="datetime-local" value={rmAt} onChange={(e) => setRmAt(e.target.value)} data-testid="rm-at" />
            <button className="btn" type="submit" data-testid="rm-save">
              Reminder setzen
            </button>
          </form>
          <Grid>
            {reminders.map((r) => (
              <div key={r.id} className="tile">
                <strong>{r.title}</strong>
                <span className="muted">{r.at}</span>
              </div>
            ))}
            {calendarDue.map((r) => (
              <div key={r.id} className="tile">
                <strong>📅 {r.title}</strong>
                <span className="muted">{r.at}</span>
              </div>
            ))}
          </Grid>
        </section>
      </PageShell>
      <Dock />
      <GuidedTour />
    </>
  );
}
