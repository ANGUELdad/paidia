"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState, LoadingBlock } from "@/components/EmptyState";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

type AuditEntry = { type: string; text: string; at?: number; profileId?: string };

const FILTERS = [
  { id: "", de: "Alle", el: "Όλα" },
  { id: "STOCK", de: "Lager", el: "Αποθήκη" },
  { id: "SCHEDULE", de: "Plan", el: "Πρόγραμμα" },
  { id: "JOURNAL", de: "Buch", el: "Βιβλίο" },
  { id: "PRESENCE", de: "Präsenz", el: "Παρουσία" },
  { id: "SHOP", de: "Liste", el: "Λίστα" },
  { id: "INCIDENT", de: "Vorfall", el: "Περιστατικό" },
  { id: "BROADCAST", de: "Rund", el: "Ανακοίνωση" },
] as const;

const TYPE_LABEL: Record<string, { de: string; el: string }> = {
  STOCK: { de: "Lager", el: "Αποθήκη" },
  STOCK_CHECK: { de: "Lager-Check", el: "Έλεγχος αποθήκης" },
  SCHEDULE: { de: "Plan", el: "Πρόγραμμα" },
  JOURNAL: { de: "Buch", el: "Βιβλίο" },
  PRESENCE: { de: "Präsenz", el: "Παρουσία" },
  SHOP: { de: "Liste", el: "Λίστα" },
  BROADCAST: { de: "Rundsendung", el: "Ανακοίνωση" },
  INCIDENT: { de: "Vorfall", el: "Περιστατικό" },
  INCIDENT_REVIEW: { de: "Vorfall geprüft", el: "Έλεγχος περιστατικού" },
  COVERAGE_GAP: { de: "Abdeckung", el: "Κάλυψη" },
  EVENT: { de: "Event", el: "Εκδήλωση" },
  LOGIN: { de: "Login", el: "Είσοδος" },
};

const COPY = {
  de: {
    eyebrow: "Buch",
    title: "Schichtbuch",
    lead: "Kurzer Tagesstand · Audit als dichte Liste.",
    today: (d: string) => `Heute ${d}`,
    write: "Schreiben",
    journalTitle: "Tagesnotiz",
    journalEmpty: "Noch leer — tippen zum Schreiben",
    auditWeek: "Audit Woche",
    emptyTitle: "Kein Audit",
    emptyHint: "Noch keine Einträge für diesen Filter.",
    retry: "Erneut laden",
    loadFail: "Buch konnte nicht geladen werden",
    saveFail: "Speichern fehlgeschlagen",
    sheetTitle: (d: string) => `Schichtbuch ${d}`,
    newEntry: "Neuer Eintrag",
    whatPh: "Was ist passiert?",
    save: "Eintrag speichern",
    saving: "Speichern…",
    close: "Schließen",
    loadingData: "Buch wird geladen…",
    noProfile: "Kein Profil",
  },
  el: {
    eyebrow: "Βιβλίο",
    title: "Βιβλίο βάρδιας",
    lead: "Σύντομη ημερήσια κατάσταση · έλεγχος ως πυκνή λίστα.",
    today: (d: string) => `Σήμερα ${d}`,
    write: "Γράψε",
    journalTitle: "Σημείωση ημέρας",
    journalEmpty: "Άδειο — πάτησε για να γράψεις",
    auditWeek: "Έλεγχος εβδομάδας",
    emptyTitle: "Χωρίς έλεγχο",
    emptyHint: "Δεν υπάρχουν καταχωρίσεις για αυτό το φίλτρο.",
    retry: "Ξανά φόρτωση",
    loadFail: "Το βιβλίο δεν φορτώθηκε",
    saveFail: "Η αποθήκευση απέτυχε",
    sheetTitle: (d: string) => `Βιβλίο βάρδιας ${d}`,
    newEntry: "Νέα καταχώριση",
    whatPh: "Was ist passiert?",
    save: "Eintrag speichern",
    saving: "Αποθήκευση…",
    close: "Κλείσιμο",
    loadingData: "Φόρτωση βιβλίου…",
    noProfile: "Δεν υπάρχει προφίλ",
  },
} as const;

export default function BookPage() {
  const { ready } = useRequireMode("staff");
  const [lang] = useLang();
  const c = COPY[lang];
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [filter, setFilter] = useState("");
  const [journalOpen, setJournalOpen] = useState(false);
  const [detail, setDetail] = useState<AuditEntry | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [profileId, setProfileId] = useState("");
  const locale = lang === "el" ? "el-GR" : "de-DE";

  function typeLabel(type: string) {
    const row = TYPE_LABEL[type];
    return row ? row[lang] : type;
  }

  async function reloadAudit() {
    const a = await api<{ entries: AuditEntry[] }>("/api/book/audit?range=week");
    setAudit(a.entries || []);
  }

  async function load() {
    setLoading(true);
    setError("");
    try {
      const s = await api<{ profileId?: string }>("/api/auth/session");
      if (!s.profileId) throw new Error(c.noProfile);
      setProfileId(s.profileId);
      const j = await api<{ note?: { text?: string } }>(`/api/book/journal/${s.profileId}?date=${today}`);
      setNote(j.note?.text || "");
      await reloadAudit();
    } catch (e) {
      setError((e as Error).message || c.loadFail);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    load().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, today]);

  useEffect(() => {
    document.body.classList.toggle("sheet-open", journalOpen || !!detail);
    return () => document.body.classList.remove("sheet-open");
  }, [journalOpen, detail]);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || !profileId || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await api<{ note: { text: string } }>("/api/book/journal", {
        method: "POST",
        body: JSON.stringify({ date: today, text, mode: "append" }),
      });
      setNote(res.note.text);
      setText("");
      setJournalOpen(false);
      await reloadAudit();
    } catch (err) {
      setError((err as Error).message || c.saveFail);
    } finally {
      setBusy(false);
    }
  }

  const filtered = useMemo(
    () => audit.filter((e) => !filter || e.type === filter || (filter === "INCIDENT" && e.type === "INCIDENT_REVIEW")),
    [audit, filter],
  );

  if (!ready) return <main className="page">{t("loading")}</main>;

  return (
    <>
      <PageShell eyebrow={c.eyebrow} title={c.title} lead={c.lead}>
        <div data-tour="tour-book">
          {error && (
            <div className="warn mb-3" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingBlock label={c.loadingData} />
          ) : (
            <>
              <div className="list-panel mb-3">
                <div className="list-sticky">
                  <span>{c.today(today)}</span>
                  <button
                    type="button"
                    className="btn-sec"
                    style={{ minHeight: 36, fontSize: "0.75rem" }}
                    onClick={() => setJournalOpen(true)}
                    disabled={!profileId}
                  >
                    {c.write}
                  </button>
                </div>
                <button type="button" className="list-row" onClick={() => setJournalOpen(true)} data-testid="journal-preview">
                  <div className="list-row__main">
                    <div className="list-row__title">{c.journalTitle}</div>
                    <div className="list-row__meta">
                      {note ? note.slice(0, 100) + (note.length > 100 ? "…" : "") : c.journalEmpty}
                    </div>
                  </div>
                  <span aria-hidden>→</span>
                </button>
              </div>

              <div className="seg-bar" aria-label={c.auditWeek}>
                {FILTERS.map((f) => (
                  <button
                    key={f.id || "all"}
                    type="button"
                    className={`btn-sec ${filter === f.id ? "ring-2 ring-[var(--brand)]" : ""}`}
                    onClick={() => setFilter(f.id)}
                  >
                    {lang === "el" ? f.el : f.de}
                  </button>
                ))}
              </div>

              {filtered.length ? (
                <div className="list-panel">
                  <div className="list-sticky">
                    <span>{c.auditWeek}</span>
                    <span>{filtered.length}</span>
                  </div>
                  {filtered.map((e, i) => (
                    <button key={`${e.type}-${e.at || i}`} type="button" className="list-row" onClick={() => setDetail(e)}>
                      <div className="list-row__main">
                        <div className="list-row__title">{typeLabel(e.type)}</div>
                        <div className="list-row__meta">
                          {(e.text || "").slice(0, 80)}
                          {(e.text || "").length > 80 ? "…" : ""}
                        </div>
                      </div>
                      <span className="muted text-xs">
                        {e.at ? new Date(e.at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={c.emptyTitle}
                  hint={c.emptyHint}
                  action={
                    <button className="btn-sec" type="button" onClick={() => load()}>
                      {c.retry}
                    </button>
                  }
                />
              )}
            </>
          )}
        </div>
      </PageShell>

      {journalOpen && (
        <div className="more-overlay" role="presentation" onClick={() => !busy && setJournalOpen(false)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>{c.sheetTitle(today)}</h2>
              <button type="button" className="more-sheet-close" aria-label={c.close} onClick={() => setJournalOpen(false)}>
                ✕
              </button>
            </header>
            {note && <pre className="mb-3 whitespace-pre-wrap text-sm text-[var(--ink)]">{note}</pre>}
            <form className="stack" onSubmit={save}>
              <label>
                {c.newEntry}
                <textarea
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-white p-3"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={c.whatPh}
                  aria-label={c.whatPh}
                />
              </label>
              <button className="btn" type="submit" disabled={!text.trim() || !profileId || busy}>
                {busy ? c.saving : c.save}
              </button>
            </form>
          </div>
        </div>
      )}

      {detail && (
        <div className="more-overlay" role="presentation" onClick={() => setDetail(null)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(ev) => ev.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>{typeLabel(detail.type)}</h2>
              <button type="button" className="more-sheet-close" aria-label={c.close} onClick={() => setDetail(null)}>
                ✕
              </button>
            </header>
            <p className="body-sm overflow-wrap-anywhere">{detail.text}</p>
            {detail.at ? <p className="muted text-xs mt-2">{new Date(detail.at).toLocaleString(locale)}</p> : null}
          </div>
        </div>
      )}

      <Dock />
    </>
  );
}
