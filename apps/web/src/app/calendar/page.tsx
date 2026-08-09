"use client";

import { FormEvent, useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState } from "@/components/EmptyState";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell } from "@/components/PageShell";
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

const STATUS_DE: Record<string, string> = {
  published: "Veröffentlicht",
  draft: "Entwurf",
};

const AUDIENCE_DE: Record<string, string> = {
  staff: "Personal",
  children: "Kinder",
  all: "Alle",
};

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
  const [detail, setDetail] = useState<EventRow | null>(null);

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

  useEffect(() => {
    document.body.classList.toggle("sheet-open", !!detail);
    return () => document.body.classList.remove("sheet-open");
  }, [detail]);

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
    setStatus("Termin gespeichert");
    await load();
  }

  async function addToGoogle(id: string) {
    const r = await api<{ url: string }>(`/api/calendar/google-link?eventId=${id}`);
    if (window.matchMedia("(display-mode: standalone)").matches) {
      window.location.assign(r.url);
    } else {
      window.open(r.url, "_blank", "noopener,noreferrer");
    }
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
    setStatus("Erinnerung gesetzt");
    await load();
  }

  return (
    <>
      <PageShell
        eyebrow="Kalender"
        title="Termine"
        lead="Kommende Termine · ICS · Erinnerungen."
        actions={
          <button type="button" className="btn-sec text-sm" onClick={() => downloadIcs()} data-testid="ics-all">
            Alle als ICS
          </button>
        }
      >
        {status && <p className="muted text-sm mb-2">{status}</p>}

        <section className="list-panel mb-3" data-tour="tour-cal">
          <div className="list-sticky">
            <span>Kommende Termine</span>
            <span>{events.length}</span>
          </div>
          {events.length ? (
            events.map((ev) => (
              <button key={ev.id} type="button" className="list-row" data-testid={`event-${ev.id}`} onClick={() => setDetail(ev)}>
                <div className="list-row__main">
                  <div className="list-row__title">{ev.title}</div>
                  <div className="list-row__meta">
                    {ev.date} · {ev.startTime || "—"}–{ev.endTime || "—"} · {STATUS_DE[ev.status] || ev.status} ·{" "}
                    {AUDIENCE_DE[ev.audience] || ev.audience}
                  </div>
                </div>
                <span aria-hidden>→</span>
              </button>
            ))
          ) : (
            <div className="list-row">
              <div className="list-row__meta">Keine Termine.</div>
            </div>
          )}
        </section>

        {admin && (
          <section className="panel stack mb-3">
            <h2 className="text-base m-0">Termin anlegen</h2>
            <form className="stack" onSubmit={createEvent}>
              <label>
                Titel
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel" data-testid="event-title" />
              </label>
              <label>
                Datum
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <button className="btn" type="submit" data-testid="event-save">
                Veröffentlichen
              </button>
            </form>
          </section>
        )}

        <section className="panel stack">
          <h2 className="text-base m-0">Persönliche Erinnerungen</h2>
          <form className="stack" onSubmit={addReminder}>
            <label>
              Titel
              <input value={rmTitle} onChange={(e) => setRmTitle(e.target.value)} placeholder="z.B. Freitagsliste" data-testid="rm-title" />
            </label>
            <label>
              Zeitpunkt
              <input type="datetime-local" value={rmAt} onChange={(e) => setRmAt(e.target.value)} data-testid="rm-at" />
            </label>
            <button className="btn" type="submit" data-testid="rm-save">
              Erinnerung setzen
            </button>
          </form>
          <div className="list-panel mt-2">
            {[...reminders, ...calendarDue].length ? (
              [...reminders, ...calendarDue].map((r) => (
                <div key={r.id} className="list-row">
                  <div className="list-row__main">
                    <div className="list-row__title">{r.title}</div>
                    <div className="list-row__meta">{r.at}</div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="Keine Erinnerungen" hint="Lege oben eine persönliche Erinnerung an." />
            )}
          </div>
        </section>
      </PageShell>

      {detail && (
        <div className="more-overlay" role="presentation" onClick={() => setDetail(null)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>{detail.title}</h2>
              <button type="button" className="more-sheet-close" aria-label="Schließen" onClick={() => setDetail(null)}>
                ✕
              </button>
            </header>
            <p className="muted text-sm">
              {detail.date} · {detail.startTime || "—"}–{detail.endTime || "—"}
            </p>
            <p className="muted text-sm">
              {STATUS_DE[detail.status] || detail.status} · {AUDIENCE_DE[detail.audience] || detail.audience}
            </p>
            {detail.notes && <p className="body-sm mt-2">{detail.notes}</p>}
            <div className="row mt-3">
              <button type="button" className="btn-sec" onClick={() => downloadIcs(detail.id)}>
                ICS laden
              </button>
              <button type="button" className="btn" onClick={() => addToGoogle(detail.id)}>
                Google öffnen
              </button>
            </div>
          </div>
        </div>
      )}

      <Dock />
      <GuidedTour />
    </>
  );
}
