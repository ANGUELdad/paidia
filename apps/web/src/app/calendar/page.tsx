"use client";

import { FormEvent, useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState, LoadingBlock } from "@/components/EmptyState";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { getStoredLang, t, type Lang } from "@/lib/i18n";
import { scheduleLocalReminder, sweepDueReminders } from "@/lib/reminders";
import { useRequireMode } from "@/lib/session";

type EventRow = {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  status: string;
  audience: string;
  notes?: string;
  location?: string;
};

type Reminder = { id: string; title: string; at: string; url: string };

const COPY = {
  de: {
    eyebrow: "Kalender",
    title: "Termine",
    lead: "Kommende Termine · ICS · Erinnerungen.",
    upcoming: "Kommende Termine",
    none: "Keine Termine.",
    create: "Termin anlegen",
    eventTitle: "Titel",
    date: "Datum",
    from: "Von",
    to: "Bis",
    audience: "Zielgruppe",
    statusLbl: "Status",
    published: "Veröffentlicht",
    draft: "Entwurf",
    reminders: "Persönliche Erinnerungen",
    when: "Zeitpunkt",
    setRm: "Erinnerung setzen",
    icsAll: "Alle als ICS",
    icsOne: "ICS laden",
    google: "Google öffnen",
    close: "Schließen",
    rmDel: "Löschen",
    noRm: "Keine Erinnerungen",
    noRmHint: "Lege oben eine persönliche Erinnerung an.",
    saved: "Termin gespeichert",
    rmSet: "Erinnerung gesetzt",
    rmGone: "Erinnerung gelöscht",
    rmNeed: "Titel und Zeitpunkt nötig",
    titleNeed: "Titel nötig",
    icsOk: "ICS heruntergeladen",
    icsFail: "ICS fehlgeschlagen",
    googleOk: "Google Kalender geöffnet",
    googleFail: "Google-Link fehlgeschlagen",
  },
  el: {
    eyebrow: "Ημερολόγιο",
    title: "Εκδηλώσεις",
    lead: "Επόμενες εκδηλώσεις · ICS · υπενθυμίσεις.",
    upcoming: "Επόμενες εκδηλώσεις",
    none: "Καμία εκδήλωση.",
    create: "Νέα εκδήλωση",
    eventTitle: "Τίτλος",
    date: "Ημερομηνία",
    from: "Από",
    to: "Έως",
    audience: "Κοινό",
    statusLbl: "Κατάσταση",
    published: "Δημοσιευμένο",
    draft: "Πρόχειρο",
    reminders: "Προσωπικές υπενθυμίσεις",
    when: "Ώρα",
    setRm: "Ορισμός υπενθύμισης",
    icsAll: "Όλα ως ICS",
    icsOne: "Λήψη ICS",
    google: "Άνοιγμα Google",
    close: "Κλείσιμο",
    rmDel: "Διαγραφή",
    noRm: "Χωρίς υπενθυμίσεις",
    noRmHint: "Πρόσθεσε μια προσωπική υπενθύμιση παραπάνω.",
    saved: "Η εκδήλωση αποθηκεύτηκε",
    rmSet: "Η υπενθύμιση ορίστηκε",
    rmGone: "Η υπενθύμιση διαγράφηκε",
    rmNeed: "Χρειάζονται τίτλος και ώρα",
    titleNeed: "Χρειάζεται τίτλος",
    icsOk: "Το ICS κατέβηκε",
    icsFail: "Αποτυχία ICS",
    googleOk: "Άνοιξε το Google Calendar",
    googleFail: "Αποτυχία συνδέσμου Google",
  },
} as const;

export default function CalendarPage() {
  const { session, ready } = useRequireMode("staff");
  const admin = !!session?.admin;
  const [lang, setLang] = useState<Lang>("de");
  const [events, setEvents] = useState<EventRow[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [calendarDue, setCalendarDue] = useState<Reminder[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [audience, setAudience] = useState("all");
  const [eventStatus, setEventStatus] = useState("published");
  const [status, setStatus] = useState("");
  const [rmTitle, setRmTitle] = useState("");
  const [rmAt, setRmAt] = useState("");
  const [detail, setDetail] = useState<EventRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const c = COPY[lang];

  function statusLabel(s: string) {
    if (s === "published") return c.published;
    if (s === "draft") return c.draft;
    return s;
  }

  function audienceLabel(a: string) {
    if (a === "staff") return t("staff", lang);
    if (a === "children") return t("children", lang);
    return t("everyone", lang);
  }

  async function load() {
    const e = await api<{ events: EventRow[] }>("/api/calendar/events");
    setEvents(e.events || []);
    const r = await api<{ reminders: Reminder[]; calendar: Reminder[] }>("/api/calendar/reminders");
    setReminders(r.reminders || []);
    setCalendarDue(r.calendar || []);
    sweepDueReminders();
  }

  useEffect(() => {
    if (!ready) return;
    setLang(getStoredLang());
    setLoading(true);
    load()
      .catch((e) => setStatus((e as Error).message || t("errorDefault")))
      .finally(() => setLoading(false));
  }, [ready]);

  useEffect(() => {
    document.body.classList.toggle("sheet-open", !!detail);
    return () => document.body.classList.remove("sheet-open");
  }, [detail]);

  async function createEvent(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setStatus(c.titleNeed);
      return;
    }
    if (busy) return;
    setBusy(true);
    setStatus("");
    try {
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
      const start = new Date(`${date}T${startTime || "10:00"}`).getTime();
      await scheduleLocalReminder(title.trim(), new Date(start - 60 * 60_000).toISOString(), "/calendar");
      setTitle("");
      setStatus(c.saved);
      await load();
    } catch (err) {
      setStatus((err as Error).message || t("errorDefault", lang));
    } finally {
      setBusy(false);
    }
  }

  async function deleteReminder(id: string) {
    try {
      await api(`/api/calendar/reminders/${id}`, { method: "DELETE" });
      setStatus(c.rmGone);
      await load();
    } catch (e) {
      setStatus((e as Error).message || t("errorDefault", lang));
    }
  }

  async function addToGoogle(id: string) {
    try {
      const r = await api<{ url: string }>(`/api/calendar/google-link?eventId=${id}`);
      if (!r.url) {
        setStatus(c.googleFail);
        return;
      }
      if (window.matchMedia("(display-mode: standalone)").matches) {
        window.location.assign(r.url);
      } else {
        window.open(r.url, "_blank", "noopener,noreferrer");
      }
      setStatus(c.googleOk);
    } catch (e) {
      setStatus((e as Error).message || c.googleFail);
    }
  }

  async function downloadIcs(id?: string) {
    const q = id ? `?eventId=${encodeURIComponent(id)}` : "";
    try {
      const res = await fetch(`/api/calendar/ics${q}`, { credentials: "include" });
      if (!res.ok) throw new Error(c.icsFail);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "armonia.ics";
      a.click();
      URL.revokeObjectURL(url);
      setStatus(c.icsOk);
    } catch (e) {
      setStatus((e as Error).message || c.icsFail);
    }
  }

  async function addReminder(e: FormEvent) {
    e.preventDefault();
    if (!rmTitle.trim() || !rmAt) {
      setStatus(c.rmNeed);
      return;
    }
    if (busy) return;
    setBusy(true);
    setStatus("");
    try {
      const r = await api<{ reminder: Reminder }>("/api/calendar/reminders", {
        method: "POST",
        body: JSON.stringify({ title: rmTitle, at: rmAt, url: "/calendar" }),
      });
      await scheduleLocalReminder(r.reminder.title, r.reminder.at, "/calendar");
      setRmTitle("");
      setStatus(c.rmSet);
      await load();
    } catch (err) {
      setStatus((err as Error).message || t("errorDefault", lang));
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">{t("loading", lang)}</main>;

  const listed = [...reminders, ...calendarDue];

  return (
    <>
      <PageShell
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.lead}
        actions={
          <button type="button" className="btn-sec text-sm" onClick={() => downloadIcs()} data-testid="ics-all">
            {c.icsAll}
          </button>
        }
      >
        {status && (
          <p className="muted text-sm mb-2" aria-live="polite">
            {status}
          </p>
        )}

        {loading ? (
          <LoadingBlock />
        ) : (
          <section className="list-panel mb-3" data-tour="tour-cal">
            <div className="list-sticky">
              <span>{c.upcoming}</span>
              <span>{events.length}</span>
            </div>
            {events.length ? (
              events.map((ev) => (
                <button key={ev.id} type="button" className="list-row" data-testid={`event-${ev.id}`} onClick={() => setDetail(ev)}>
                  <div className="list-row__main">
                    <div className="list-row__title">{ev.title}</div>
                    <div className="list-row__meta">
                      {ev.date} · {ev.startTime || "—"}–{ev.endTime || "—"} · {statusLabel(ev.status)} · {audienceLabel(ev.audience)}
                    </div>
                  </div>
                  <span aria-hidden>→</span>
                </button>
              ))
            ) : (
              <div className="list-row">
                <div className="list-row__meta">{c.none}</div>
              </div>
            )}
          </section>
        )}

        {admin && (
          <section className="list-panel mb-3">
            <div className="list-sticky">
              <span>{c.create}</span>
            </div>
            <form className="stack p-3" onSubmit={createEvent}>
              <label>
                {c.eventTitle}
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={c.eventTitle} data-testid="event-title" />
              </label>
              <label>
                {c.date}
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <div className="row gap-2">
                <label className="flex-1 m-0">
                  {c.from}
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} data-testid="event-start" />
                </label>
                <label className="flex-1 m-0">
                  {c.to}
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} data-testid="event-end" />
                </label>
              </div>
              <label>
                {c.audience}
                <select value={audience} onChange={(e) => setAudience(e.target.value)} data-testid="event-audience">
                  <option value="all">{t("everyone", lang)}</option>
                  <option value="staff">{t("staff", lang)}</option>
                  <option value="children">{t("children", lang)}</option>
                </select>
              </label>
              <label>
                {c.statusLbl}
                <select value={eventStatus} onChange={(e) => setEventStatus(e.target.value)} data-testid="event-status">
                  <option value="published">{c.published}</option>
                  <option value="draft">{c.draft}</option>
                </select>
              </label>
              <button className="btn" type="submit" data-testid="event-save" disabled={busy}>
                {t("save", lang)}
              </button>
            </form>
          </section>
        )}

        <section className="list-panel">
          <div className="list-sticky">
            <span>{c.reminders}</span>
          </div>
          <form className="stack p-3" onSubmit={addReminder}>
            <label>
              {c.eventTitle}
              <input value={rmTitle} onChange={(e) => setRmTitle(e.target.value)} placeholder={c.eventTitle} data-testid="rm-title" />
            </label>
            <label>
              {c.when}
              <input type="datetime-local" value={rmAt} onChange={(e) => setRmAt(e.target.value)} data-testid="rm-at" />
            </label>
            <button className="btn" type="submit" data-testid="rm-save" disabled={busy}>
              {c.setRm}
            </button>
          </form>
          <div>
            {listed.length ? (
              listed.map((r) => (
                <div key={r.id} className="list-row">
                  <div className="list-row__main">
                    <div className="list-row__title">{r.title}</div>
                    <div className="list-row__meta">{r.at}</div>
                  </div>
                  {reminders.some((x) => x.id === r.id) ? (
                    <button type="button" className="btn-sec" style={{ minHeight: 36, fontSize: "0.75rem" }} onClick={() => deleteReminder(r.id)}>
                      {c.rmDel}
                    </button>
                  ) : null}
                </div>
              ))
            ) : (
              <EmptyState title={c.noRm} hint={c.noRmHint} />
            )}
          </div>
        </section>
      </PageShell>

      {detail && (
        <div className="more-overlay" role="presentation" onClick={() => setDetail(null)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>{detail.title}</h2>
              <button type="button" className="more-sheet-close" aria-label={c.close} onClick={() => setDetail(null)}>
                ✕
              </button>
            </header>
            <p className="muted text-sm">
              {detail.date} · {detail.startTime || "—"}–{detail.endTime || "—"}
            </p>
            <p className="muted text-sm">
              {statusLabel(detail.status)} · {audienceLabel(detail.audience)}
              {detail.location ? ` · ${detail.location}` : ""}
            </p>
            {detail.notes && <p className="body-sm mt-2">{detail.notes}</p>}
            <div className="row mt-3">
              <button type="button" className="btn-sec" onClick={() => downloadIcs(detail.id)}>
                {c.icsOne}
              </button>
              <button type="button" className="btn" onClick={() => addToGoogle(detail.id)}>
                {c.google}
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
