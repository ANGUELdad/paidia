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
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [audience, setAudience] = useState("all");
  const [eventStatus, setEventStatus] = useState("published");
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
        startTime,
        endTime,
        audience,
        status: eventStatus,
        remindMinutes: [60, 15],
      }),
    });
    setTitle("");
    setStatus("Termin gespeichert");
    await load();
  }

  async function deleteReminder(id: string) {
    try {
      await api(`/api/calendar/reminders/${id}`, { method: "DELETE" });
      setStatus("Erinnerung gelöscht");
      await load();
    } catch (e) {
      setStatus((e as Error).message || "Löschen fehlgeschlagen");
    }
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
        back="/home"
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
          <section className="list-panel mb-3">
            <div className="list-sticky">
              <span>Termin anlegen</span>
            </div>
            <form className="stack p-3" onSubmit={createEvent}>
              <label>
                Titel
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel" data-testid="event-title" />
              </label>
              <label>
                Datum
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <div className="row gap-2">
                <label className="flex-1 m-0">
                  Von
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} data-testid="event-start" />
                </label>
                <label className="flex-1 m-0">
                  Bis
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} data-testid="event-end" />
                </label>
              </div>
              <label>
                Zielgruppe
                <select value={audience} onChange={(e) => setAudience(e.target.value)} data-testid="event-audience">
                  <option value="all">Alle</option>
                  <option value="staff">Personal</option>
                  <option value="children">Kinder</option>
                </select>
              </label>
              <label>
                Status
                <select value={eventStatus} onChange={(e) => setEventStatus(e.target.value)} data-testid="event-status">
                  <option value="published">Veröffentlicht</option>
                  <option value="draft">Entwurf</option>
                </select>
              </label>
              <button className="btn" type="submit" data-testid="event-save">
                Speichern
              </button>
            </form>
          </section>
        )}

        <section className="list-panel">
          <div className="list-sticky">
            <span>Persönliche Erinnerungen</span>
          </div>
          <form className="stack p-3" onSubmit={addReminder}>
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
          <div>
            {[...reminders, ...calendarDue].length ? (
              [...reminders, ...calendarDue].map((r) => (
                <div key={r.id} className="list-row">
                  <div className="list-row__main">
                    <div className="list-row__title">{r.title}</div>
                    <div className="list-row__meta">{r.at}</div>
                  </div>
                  {reminders.some((x) => x.id === r.id) ? (
                    <button type="button" className="btn-sec" style={{ minHeight: 36, fontSize: "0.75rem" }} onClick={() => deleteReminder(r.id)}>
                      Löschen
                    </button>
                  ) : null}
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
