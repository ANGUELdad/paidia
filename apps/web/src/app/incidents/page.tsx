"use client";

import { FormEvent, useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState, LoadingBlock } from "@/components/EmptyState";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

type House = { id: string; name: string };

type Incident = {
  id: string;
  severity: string;
  houseId: string;
  text: string;
  childIds?: string[];
  staffIds?: string[];
  reviewed?: boolean;
  at?: number;
  by?: string;
  reviewedAt?: number;
  reviewedBy?: string;
  date?: string;
};

const SEVERITIES = [
  { id: "low", de: "Gering", el: "Χαμηλή", hintDe: "Beobachtung, kein akuter Handlungsbedarf", hintEl: "Παρατήρηση, χωρίς άμεση ενέργεια" },
  { id: "med", de: "Mittel", el: "Μεσαία", hintDe: "Team sollte informiert werden", hintEl: "Η ομάδα πρέπει να ενημερωθεί" },
  { id: "high", de: "Hoch", el: "Υψηλή", hintDe: "Sofortige Aufmerksamkeit nötig", hintEl: "Άμεση προσοχή" },
] as const;

const COPY = {
  de: {
    eyebrow: "Schicht",
    title: "Vorfälle",
    lead: "Liste · Tippen für Details · Melden unten.",
    open: "Offen",
    all: "Alle",
    loadingData: "Vorfälle werden geladen…",
    emptyTitle: "Noch keine Vorfälle",
    emptyHint: "Melde Beobachtungen — sie erscheinen hier.",
    retry: "Erneut laden",
    loadFail: "Vorfälle konnten nicht geladen werden",
    saveFail: "Speichern fehlgeschlagen",
    reviewFail: "Prüfung fehlgeschlagen",
    saved: "Vorfall gesichert.",
    reviewed: "Vorfall als geprüft markiert.",
    compose: "Vorfall melden",
    formTitle: "Vorfall melden",
    severity: "Schweregrad",
    house: "Haus",
    noHouses: "Keine Häuser geladen",
    what: "Was ist passiert?",
    whatPh: "Sachlich beschreiben — wer, was, wann, wo…",
    kids: "Betroffene Kinder",
    noKids: "Keine Kinderprofile",
    save: "Vorfall sichern",
    saving: "Speichern…",
    markReviewed: "Als geprüft markieren",
    close: "Schließen",
    kidsLabel: "Kinder",
    statusReviewed: "Geprüft",
    entries: (n: number) => `${n} Einträge`,
  },
  el: {
    eyebrow: "Βάρδια",
    title: "Περιστατικά",
    lead: "Λίστα · πάτημα για λεπτομέρειες · αναφορά κάτω.",
    open: "Ανοιχτά",
    all: "Όλα",
    loadingData: "Φόρτωση περιστατικών…",
    emptyTitle: "Δεν υπάρχουν περιστατικά",
    emptyHint: "Καταχώρισε παρατηρήσεις — εμφανίζονται εδώ.",
    retry: "Ξανά φόρτωση",
    loadFail: "Τα περιστατικά δεν φορτώθηκαν",
    saveFail: "Η αποθήκευση απέτυχε",
    reviewFail: "Ο έλεγχος απέτυχε",
    saved: "Το περιστατικό αποθηκεύτηκε.",
    reviewed: "Το περιστατικό σημάνθηκε ως ελεγμένο.",
    compose: "Αναφορά περιστατικού",
    formTitle: "Αναφορά περιστατικού",
    severity: "Σοβαρότητα",
    house: "Σπίτι",
    noHouses: "Δεν φορτώθηκαν σπίτια",
    what: "Τι συνέβη;",
    whatPh: "Περιγραφή με γεγονότα — ποιος, τι, πότε, πού…",
    kids: "Παιδιά που επηρεάζονται",
    noKids: "Δεν υπάρχουν προφίλ παιδιών",
    save: "Αποθήκευση περιστατικού",
    saving: "Αποθήκευση…",
    markReviewed: "Σήμανση ως ελεγμένο",
    close: "Κλείσιμο",
    kidsLabel: "Παιδιά",
    statusReviewed: "Ελεγμένο",
    entries: (n: number) => `${n} καταχωρίσεις`,
  },
} as const;

export default function IncidentsPage() {
  const { session, ready } = useRequireMode("staff");
  const [lang] = useLang();
  const c = COPY[lang];
  const [houses, setHouses] = useState<House[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState<"open" | "all">("open");
  const [composeOpen, setComposeOpen] = useState(false);
  const [detail, setDetail] = useState<Incident | null>(null);

  const [severity, setSeverity] = useState<(typeof SEVERITIES)[number]["id"]>("med");
  const [houseId, setHouseId] = useState("");
  const [text, setText] = useState("");
  const [childIds, setChildIds] = useState<string[]>([]);
  const [children, setChildren] = useState<Array<{ id: string; name: string }>>([]);

  function houseName(id: string) {
    return houses.find((h) => h.id === id)?.name || id;
  }

  function sevLabel(id: string) {
    const s = SEVERITIES.find((x) => x.id === id);
    if (!s) return id;
    return lang === "el" ? s.el : s.de;
  }

  async function load(quiet = false) {
    if (!quiet) setLoading(true);
    setError("");
    try {
      const [list, stock, kids] = await Promise.all([
        api<{ incidents: Incident[] }>("/api/incidents"),
        api<{ houses: House[] }>("/api/stock/snapshot").catch(() => ({ houses: [] as House[] })),
        api<{ profiles: Array<{ id: string; name: string }> }>("/api/auth/profiles?mode=child").catch(() => ({
          profiles: [] as Array<{ id: string; name: string }>,
        })),
      ]);
      setIncidents(list.incidents || []);
      setChildren(kids.profiles || []);
      const hs = stock.houses || [];
      setHouses(hs);
      setHouseId((prev) => (hs.some((h) => h.id === prev) ? prev : hs[0]?.id || ""));
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
  }, [ready]);

  useEffect(() => {
    document.body.classList.toggle("sheet-open", composeOpen || !!detail);
    return () => document.body.classList.remove("sheet-open");
  }, [composeOpen, detail]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || !houseId || busy) return;
    setBusy(true);
    setError("");
    setMsg("");
    try {
      await api("/api/incidents", {
        method: "POST",
        body: JSON.stringify({ severity, houseId, text: text.trim(), childIds }),
      });
      setText("");
      setChildIds([]);
      setSeverity("med");
      setComposeOpen(false);
      setMsg(c.saved);
      await load(true);
    } catch (err) {
      setError((err as Error).message || c.saveFail);
    } finally {
      setBusy(false);
    }
  }

  async function review(id: string) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api(`/api/incidents/${id}/review`, { method: "POST", body: JSON.stringify({}) });
      setMsg(c.reviewed);
      setDetail(null);
      await load(true);
    } catch (err) {
      setError((err as Error).message || c.reviewFail);
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">{t("loading")}</main>;

  const isAdmin = !!session?.admin;
  const shown = incidents.filter((inc) => filter === "all" || !inc.reviewed);
  const hint = SEVERITIES.find((s) => s.id === severity);
  const locale = lang === "el" ? "el-GR" : "de-DE";

  return (
    <>
      <PageShell eyebrow={c.eyebrow} title={c.title} lead={c.lead}>
        {error && (
          <div className="warn mb-3" role="alert">
            {error}
          </div>
        )}
        {msg && <p className="muted text-sm mb-2">{msg}</p>}

        <div className="seg-bar">
          <button type="button" className={`btn-sec ${filter === "open" ? "ring-2 ring-[var(--brand)]" : ""}`} onClick={() => setFilter("open")}>
            {c.open}
          </button>
          <button type="button" className={`btn-sec ${filter === "all" ? "ring-2 ring-[var(--brand)]" : ""}`} onClick={() => setFilter("all")}>
            {c.all}
          </button>
        </div>

        {loading ? (
          <LoadingBlock label={c.loadingData} />
        ) : !shown.length ? (
          <EmptyState
            title={c.emptyTitle}
            hint={c.emptyHint}
            action={
              <button className="btn-sec" type="button" onClick={() => load()}>
                {c.retry}
              </button>
            }
          />
        ) : (
          <div className="list-panel" data-testid="incident-list">
            <div className="list-sticky">
              <span>{c.entries(shown.length)}</span>
            </div>
            {shown.map((inc) => {
              const open = !inc.reviewed;
              return (
                <button
                  key={inc.id}
                  type="button"
                  className={`list-row ${inc.severity === "high" ? "is-warn" : ""}`}
                  data-testid={`incident-${inc.id}`}
                  onClick={() => setDetail(inc)}
                >
                  <div className="list-row__main">
                    <div className="list-row__title">
                      {sevLabel(inc.severity)} · {houseName(inc.houseId)}
                    </div>
                    <div className="list-row__meta">
                      {inc.text.slice(0, 72)}
                      {inc.text.length > 72 ? "…" : ""}
                    </div>
                  </div>
                  <span className="list-row__trail muted text-xs">
                    {inc.reviewed ? c.statusReviewed : c.open}
                    {open ? " →" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="sticky-footer">
          <button className="btn w-full" type="button" data-testid="incident-compose" onClick={() => setComposeOpen(true)}>
            {c.compose}
          </button>
        </div>
      </PageShell>

      {composeOpen && (
        <div className="more-overlay" role="presentation" onClick={() => !busy && setComposeOpen(false)}>
          <div className="more-sheet" role="dialog" aria-modal="true" aria-labelledby="incident-form-title" onClick={(e) => e.stopPropagation()}>
            <header className="more-sheet-header">
              <h2 id="incident-form-title">{c.formTitle}</h2>
              <button type="button" className="more-sheet-close" aria-label={c.close} onClick={() => setComposeOpen(false)}>
                ✕
              </button>
            </header>
            <form className="stack" onSubmit={submit} data-testid="incident-form">
              <fieldset className="stack">
                <legend className="font-semibold">{c.severity}</legend>
                <div className="chips">
                  {SEVERITIES.map((s) => (
                    <button key={s.id} type="button" className={severity === s.id ? "chip on" : "chip"} onClick={() => setSeverity(s.id)}>
                      {lang === "el" ? s.el : s.de}
                    </button>
                  ))}
                </div>
                <p className="muted text-sm m-0">{hint ? (lang === "el" ? hint.hintEl : hint.hintDe) : ""}</p>
              </fieldset>
              <label htmlFor="incident-house">
                {c.house}
                <select id="incident-house" value={houseId} onChange={(e) => setHouseId(e.target.value)} required>
                  {!houses.length && <option value="">{c.noHouses}</option>}
                  {houses.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="incident-text">
                {c.what}
                <textarea
                  id="incident-text"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={c.whatPh}
                  required
                />
              </label>
              <fieldset className="stack m-0 border-0 p-0">
                <legend className="font-semibold">{c.kids}</legend>
                <div className="chips" id="incident-children">
                  {children.map((ch) => {
                    const on = childIds.includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        className={on ? "chip on" : "chip"}
                        onClick={() => setChildIds((prev) => (on ? prev.filter((id) => id !== ch.id) : [...prev, ch.id]))}
                      >
                        {ch.name}
                      </button>
                    );
                  })}
                  {!children.length && <span className="muted text-sm">{c.noKids}</span>}
                </div>
              </fieldset>
              <button className="btn w-full" type="submit" disabled={busy || !text.trim() || !houseId}>
                {busy ? c.saving : c.save}
              </button>
            </form>
          </div>
        </div>
      )}

      {detail && (
        <div className="more-overlay" role="presentation" onClick={() => setDetail(null)}>
          <div className="more-sheet" role="dialog" aria-modal="true" aria-labelledby="incident-detail-title" onClick={(e) => e.stopPropagation()}>
            <header className="more-sheet-header">
              <h2 id="incident-detail-title">
                {sevLabel(detail.severity)} · {houseName(detail.houseId)}
              </h2>
              <button type="button" className="more-sheet-close" aria-label={c.close} onClick={() => setDetail(null)}>
                ✕
              </button>
            </header>
            <p className="body-sm">{detail.text}</p>
            {detail.childIds?.length ? (
              <p className="muted text-sm">
                {c.kidsLabel}: {detail.childIds.map((id) => children.find((ch) => ch.id === id)?.name || id).join(", ")}
              </p>
            ) : null}
            {detail.at ? (
              <p className="muted text-xs">
                {new Date(detail.at).toLocaleString(locale)}
                {detail.by ? ` · ${detail.by}` : ""}
              </p>
            ) : null}
            {detail.reviewedAt ? (
              <p className="muted text-xs">
                {c.markReviewed} {new Date(detail.reviewedAt).toLocaleString(locale)}
                {detail.reviewedBy ? ` · ${detail.reviewedBy}` : ""}
              </p>
            ) : null}
            {isAdmin && !detail.reviewed && (
              <button className="btn mt-3 w-full" type="button" disabled={busy} onClick={() => review(detail.id)} data-testid={`review-${detail.id}`}>
                {c.markReviewed}
              </button>
            )}
          </div>
        </div>
      )}

      <Dock />
    </>
  );
}
