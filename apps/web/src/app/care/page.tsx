"use client";

import { useEffect, useMemo, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState, LoadingBlock } from "@/components/EmptyState";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

type ChildProfile = { id: string; name: string; color?: string };

type CareLog = {
  id: string;
  childId: string;
  childName?: string;
  date: string;
  kind: string;
  note?: string;
  value?: string;
  at?: number;
  by?: string;
};

const KINDS = [
  { id: "meal", de: "Mahlzeit", el: "Γεύμα", emoji: "🍽" },
  { id: "sleep", de: "Schlaf", el: "Ύπνος", emoji: "😴" },
  { id: "mood", de: "Stimmung", el: "Διάθεση", emoji: "🙂" },
  { id: "meds", de: "Medikamente", el: "Φάρμακα", emoji: "💊" },
] as const;

const COPY = {
  de: {
    eyebrow: "Schicht",
    title: "Kind-Tag",
    lead: (d: string) => `Pflege-Notizen für ${d}.`,
    child: "Kind",
    date: "Datum",
    noKids: "Keine Kinder",
    add: "Eintrag hinzufügen",
    note: "Kurznotiz (optional)",
    notePh: "z. B. gut gegessen, müde, fröhlich…",
    save: "Speichern",
    saving: "Speichern…",
    cancel: "Abbrechen",
    entries: "Einträge",
    count: (n: number) => `${n} Einträge`,
    loadingData: "Einträge werden geladen…",
    emptyTitle: "Noch keine Einträge",
    emptyHint: "Wähle oben Mahlzeit, Schlaf, Stimmung oder Medikamente und speichere einen Kurzeintrag.",
    emptyKids: "Keine Kinderprofile",
    emptyKidsHint: "Kinderprofile erscheinen hier, sobald sie im System sind.",
    retry: "Erneut laden",
    loadFail: "Einträge konnten nicht geladen werden",
    saveFail: "Speichern fehlgeschlagen",
    saved: (k: string) => `${k} gespeichert.`,
    close: "Schließen",
    none: "—",
  },
  el: {
    eyebrow: "Βάρδια",
    title: "Ημέρα παιδιού",
    lead: (d: string) => `Σημειώσεις φροντίδας για ${d}.`,
    child: "Παιδί",
    date: "Ημερομηνία",
    noKids: "Δεν υπάρχουν παιδιά",
    add: "Προσθήκη καταχώρισης",
    note: "Σύντομη σημείωση (προαιρετικό)",
    notePh: "π.χ. έφαγε καλά, κουρασμένο, χαρούμενο…",
    save: "Αποθήκευση",
    saving: "Αποθήκευση…",
    cancel: "Ακύρωση",
    entries: "Καταχωρίσεις",
    count: (n: number) => `${n} καταχωρίσεις`,
    loadingData: "Φόρτωση καταχωρίσεων…",
    emptyTitle: "Δεν υπάρχουν καταχωρίσεις",
    emptyHint: "Διάλεξε γεύμα, ύπνο, διάθεση ή φάρμακα και αποθήκευσε μια σύντομη σημείωση.",
    emptyKids: "Δεν υπάρχουν προφίλ παιδιών",
    emptyKidsHint: "Τα προφίλ παιδιών εμφανίζονται εδώ όταν υπάρχουν στο σύστημα.",
    retry: "Ξανά φόρτωση",
    loadFail: "Οι καταχωρίσεις δεν φορτώθηκαν",
    saveFail: "Η αποθήκευση απέτυχε",
    saved: (k: string) => `${k} αποθηκεύτηκε.`,
    close: "Κλείσιμο",
    none: "—",
  },
} as const;

export default function CarePage() {
  const { ready } = useRequireMode("staff");
  const [lang] = useLang();
  const c = COPY[lang];
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [childId, setChildId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [logs, setLogs] = useState<CareLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [activeKind, setActiveKind] = useState<string | null>(null);
  const [detail, setDetail] = useState<CareLog | null>(null);
  const [note, setNote] = useState("");

  const displayDate = useMemo(
    () =>
      new Date(date + "T12:00:00").toLocaleDateString(lang === "el" ? "el-GR" : "de-DE", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [date, lang],
  );

  function kindLabel(id: string) {
    const k = KINDS.find((x) => x.id === id);
    if (!k) return id;
    return lang === "el" ? k.el : k.de;
  }

  async function loadChildren() {
    setLoading(true);
    setError("");
    try {
      const data = await api<{ profiles: ChildProfile[] }>("/api/auth/profiles?mode=child");
      const list = data.profiles || [];
      setChildren(list);
      const nextId = list[0]?.id || "";
      setChildId((prev) => (prev && list.some((ch) => ch.id === prev) ? prev : nextId));
      if (!list.length) {
        setLogs([]);
        setLoading(false);
      }
    } catch (e) {
      setError((e as Error).message || c.loadFail);
      setChildren([]);
      setChildId("");
      setLogs([]);
      setLoading(false);
    }
  }

  async function loadLogs(selectedChild = childId, selectedDate = date, quiet = false) {
    if (!selectedChild) {
      setLogs([]);
      setLoading(false);
      return;
    }
    if (!quiet) setLoading(true);
    setError("");
    try {
      const data = await api<{ logs: CareLog[] }>(
        `/api/care/log?childId=${encodeURIComponent(selectedChild)}&date=${encodeURIComponent(selectedDate)}`,
      );
      setLogs(data.logs || []);
    } catch (e) {
      setError((e as Error).message || c.loadFail);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    loadChildren().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    if (!childId) {
      setLoading(false);
      return;
    }
    loadLogs(childId, date).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, childId, date]);

  useEffect(() => {
    document.body.classList.toggle("sheet-open", !!activeKind || !!detail);
    return () => document.body.classList.remove("sheet-open");
  }, [activeKind, detail]);

  async function saveLog() {
    if (!childId || !activeKind || busy) return;
    setBusy(true);
    setError("");
    setMsg("");
    try {
      await api("/api/care/log", {
        method: "POST",
        body: JSON.stringify({ childId, date, kind: activeKind, note: note.trim() }),
      });
      setMsg(c.saved(kindLabel(activeKind)));
      setActiveKind(null);
      setNote("");
      await loadLogs(childId, date, true);
    } catch (e) {
      setError((e as Error).message || c.saveFail);
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">{t("loading")}</main>;

  const selectedChild = children.find((ch) => ch.id === childId);
  const locale = lang === "el" ? "el-GR" : "de-DE";
  const active = KINDS.find((k) => k.id === activeKind);

  return (
    <>
      <PageShell eyebrow={c.eyebrow} title={c.title} lead={c.lead(displayDate)}>
        {error && (
          <div className="warn mb-3" role="alert">
            {error}
          </div>
        )}
        {msg && <p className="text-sm text-[var(--brand)] mb-3">{msg}</p>}

        <div className="list-panel mb-3">
          <div className="list-sticky">
            <span>{selectedChild?.name || c.child}</span>
            <span className="muted text-xs">{displayDate}</span>
          </div>
          <div className="list-row" style={{ cursor: "default", flexWrap: "wrap", gap: 8 }}>
            <label className="flex-1 min-w-[140px] m-0" htmlFor="care-child">
              <span className="sr-only">{c.child}</span>
              <select id="care-child" value={childId} onChange={(e) => setChildId(e.target.value)} data-testid="care-child">
                {!children.length && <option value="">{c.noKids}</option>}
                {children.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="m-0" htmlFor="care-date">
              <span className="sr-only">{c.date}</span>
              <input id="care-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} data-testid="care-date" />
            </label>
          </div>
        </div>

        {!children.length && !loading ? (
          <EmptyState
            title={c.emptyKids}
            hint={c.emptyKidsHint}
            action={
              <button className="btn-sec" type="button" onClick={() => loadChildren()}>
                {c.retry}
              </button>
            }
          />
        ) : (
          <>
            <section className="mb-4" aria-labelledby="care-kinds-title">
              <h2 id="care-kinds-title" className="text-sm font-semibold text-[var(--sea)] m-0 mb-2">
                {c.add}
              </h2>
              <div className="chips">
                {KINDS.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    className={activeKind === k.id ? "chip on" : "chip"}
                    onClick={() => {
                      if (!childId) return;
                      setActiveKind(k.id);
                      setNote("");
                    }}
                    disabled={!childId}
                    data-testid={`care-kind-${k.id}`}
                  >
                    <span aria-hidden>{k.emoji}</span> {lang === "el" ? k.el : k.de}
                  </button>
                ))}
              </div>
            </section>

            <section aria-labelledby="care-logs-title">
              <h2 id="care-logs-title" className="text-sm font-semibold text-[var(--sea)] m-0 mb-2">
                {c.entries}
              </h2>

              {loading ? (
                <LoadingBlock label={c.loadingData} />
              ) : !logs.length ? (
                <EmptyState
                  title={c.emptyTitle}
                  hint={c.emptyHint}
                  action={
                    <button className="btn-sec" type="button" onClick={() => loadLogs()}>
                      {c.retry}
                    </button>
                  }
                />
              ) : (
                <div className="list-panel">
                  <div className="list-sticky">
                    <span>{c.count(logs.length)}</span>
                  </div>
                  {logs.map((log) => {
                    const kind = KINDS.find((k) => k.id === log.kind);
                    return (
                      <button
                        key={log.id}
                        type="button"
                        className="list-row"
                        data-testid={`care-log-${log.id}`}
                        onClick={() => setDetail(log)}
                      >
                        <div className="list-row__main">
                          <div className="list-row__title">
                            {kind?.emoji} {kindLabel(log.kind)}
                          </div>
                          <div className="list-row__meta">
                            {log.note || c.none}
                            {log.by ? ` · ${log.by}` : ""}
                          </div>
                        </div>
                        <span className="list-row__trail muted text-xs">
                          {log.at ? new Date(log.at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }) : "→"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </PageShell>

      {activeKind && (
        <div className="more-overlay" role="presentation" onClick={() => !busy && setActiveKind(null)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>
                {active ? `${active.emoji} ${kindLabel(active.id)}` : kindLabel(activeKind)} · {selectedChild?.name}
              </h2>
              <button type="button" className="more-sheet-close" aria-label={c.close} onClick={() => setActiveKind(null)}>
                ✕
              </button>
            </header>
            <div className="stack">
              <label htmlFor="care-note" className="m-0">
                {c.note}
                <textarea id="care-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={c.notePh} />
              </label>
              <button className="btn w-full" type="button" disabled={busy || !childId} onClick={saveLog}>
                {busy ? c.saving : c.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {detail && (
        <div className="more-overlay" role="presentation" onClick={() => setDetail(null)}>
          <div className="more-sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <header className="more-sheet-header">
              <h2>
                {KINDS.find((k) => k.id === detail.kind)?.emoji} {kindLabel(detail.kind)}
              </h2>
              <button type="button" className="more-sheet-close" aria-label={c.close} onClick={() => setDetail(null)}>
                ✕
              </button>
            </header>
            <p className="body-sm">{detail.note || c.none}</p>
            {detail.value ? <p className="muted text-sm">{detail.value}</p> : null}
            <p className="muted text-xs">
              {selectedChild?.name || detail.childId}
              {detail.by ? ` · ${detail.by}` : ""}
              {detail.at ? ` · ${new Date(detail.at).toLocaleString(locale)}` : ""}
            </p>
          </div>
        </div>
      )}
      <Dock />
    </>
  );
}
