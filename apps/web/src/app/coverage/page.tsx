"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Dock } from "@/components/Dock";
import { EmptyState, LoadingBlock } from "@/components/EmptyState";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

type StaffProfile = { id: string; name: string };

type CoverageEntry = {
  id?: string;
  block?: string;
  activity?: string;
  from?: string;
  to?: string;
  employeeIds?: string[];
  cancelled?: boolean;
};

type CoverageGap = {
  houseId: string;
  houseName?: string;
  block: string;
  from?: string;
  to?: string;
};

type CoverageLate = {
  profileId: string;
  name: string;
  houseId?: string;
  houseName?: string;
  reason?: string;
};

type CoverageHouse = {
  id: string;
  name: string;
  entries?: CoverageEntry[];
  staffPresent?: string[];
  gaps?: Array<{ block: string; from?: string; to?: string }>;
  late?: CoverageLate[];
};

type CoverageToday = {
  date: string;
  houses: CoverageHouse[];
};

type RowDetail =
  | { kind: "gap"; gap: CoverageGap }
  | { kind: "late"; late: CoverageLate }
  | { kind: "entry"; house: CoverageHouse; entry: CoverageEntry };

const BLOCK_LABEL = {
  de: { morning: "Vormittag", afternoon: "Nachmittag", evening: "Abend" },
  el: { morning: "Πρωί", afternoon: "Απόγευμα", evening: "Βράδυ" },
} as const;

const COPY = {
  de: {
    eyebrow: "Schicht",
    title: "Abdeckung",
    lead: (d: string) => `${d} — wer ist in welchem Haus?`,
    loadingData: "Abdeckung wird geladen…",
    emptyTitle: "Keine Abdeckungsdaten",
    emptyHint: "Für heute sind noch keine Haus-Spuren hinterlegt.",
    retry: "Erneut laden",
    loadFail: "Abdeckung konnte nicht geladen werden",
    reportFail: "Meldung fehlgeschlagen",
    reported: "Lücke gemeldet — Admin wird informiert.",
    gapTitle: "Lücke melden",
    gapNote: "Kurznotiz (optional)",
    gapPh: "z. B. Krankmeldung, Ausfall…",
    sendAdmin: "An Admin melden",
    sending: "Senden…",
    close: "Schließen",
    gapsLate: (g: number, l: number) => `${g} Lücken · ${l} verspätet`,
    late: "Verspätet",
    nobody: "Niemand eingeteilt",
    noBlocks: "Keine Einträge für dieses Haus",
    allCovered: "Keine offenen Lücken",
    allCoveredMeta: "Verspätungen, falls vorhanden, stehen oben.",
    present: "Da",
    report: "Melden",
    openPlan: "Zum Plan",
    staff: "Personal",
  },
  el: {
    eyebrow: "Βάρδια",
    title: "Κάλυψη",
    lead: (d: string) => `${d} — ποιος είναι σε ποιο σπίτι;`,
    loadingData: "Φόρτωση κάλυψης…",
    emptyTitle: "Δεν υπάρχουν δεδομένα κάλυψης",
    emptyHint: "Δεν έχουν καταχωριστεί ακόμα ίχνη σπιτιών για σήμερα.",
    retry: "Ξανά φόρτωση",
    loadFail: "Η κάλυψη δεν φορτώθηκε",
    reportFail: "Η αναφορά απέτυχε",
    reported: "Το κενό δηλώθηκε — ενημερώνεται ο διαχειριστής.",
    gapTitle: "Αναφορά κενού",
    gapNote: "Σύντομη σημείωση (προαιρετικό)",
    gapPh: "π.χ. ασθένεια, απουσία…",
    sendAdmin: "Αποστολή στον διαχειριστή",
    sending: "Αποστολή…",
    close: "Κλείσιμο",
    gapsLate: (g: number, l: number) => `${g} κενά · ${l} καθυστερημένοι`,
    late: "Καθυστέρηση",
    nobody: "Κανείς δεν έχει οριστεί",
    noBlocks: "Δεν υπάρχουν καταχωρίσεις για αυτό το σπίτι",
    allCovered: "Χωρίς ανοιχτά κενά",
    allCoveredMeta: "Καθυστερήσεις, αν υπάρχουν, φαίνονται πάνω.",
    present: "Εδώ",
    report: "Αναφορά",
    openPlan: "Στο πρόγραμμα",
    staff: "Προσωπικό",
  },
} as const;

export default function CoveragePage() {
  const { session, ready } = useRequireMode("staff");
  const [lang] = useLang();
  const c = COPY[lang];
  const blocks = BLOCK_LABEL[lang];
  const [data, setData] = useState<CoverageToday | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reportGap, setReportGap] = useState<CoverageGap | null>(null);
  const [detail, setDetail] = useState<RowDetail | null>(null);
  const [reportNote, setReportNote] = useState("");
  const [msg, setMsg] = useState("");

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const displayDate = useMemo(
    () =>
      new Date(today + "T12:00:00").toLocaleDateString(lang === "el" ? "el-GR" : "de-DE", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [today, lang],
  );

  function blockLabel(id?: string) {
    if (!id) return "";
    return (blocks as Record<string, string>)[id] || id;
  }

  function staffName(id: string) {
    return names[id] || id;
  }

  async function load(quiet = false) {
    if (!quiet) setLoading(true);
    setError("");
    try {
      const [res, profiles] = await Promise.all([
        api<CoverageToday>("/api/coverage/today"),
        api<{ profiles: StaffProfile[] }>("/api/auth/profiles?mode=staff").catch(() => ({
          profiles: [] as StaffProfile[],
        })),
      ]);
      setData(res);
      const map: Record<string, string> = {};
      for (const p of profiles.profiles || []) map[p.id] = p.name;
      setNames(map);
    } catch (e) {
      setError((e as Error).message || c.loadFail);
      setData(null);
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
    document.body.classList.toggle("sheet-open", !!reportGap || !!detail);
    return () => document.body.classList.remove("sheet-open");
  }, [reportGap, detail]);

  const gaps: CoverageGap[] = useMemo(() => {
    const out: CoverageGap[] = [];
    for (const house of data?.houses || []) {
      for (const g of house.gaps || []) {
        out.push({ houseId: house.id, houseName: house.name, block: g.block, from: g.from, to: g.to });
      }
    }
    return out;
  }, [data]);

  const late: CoverageLate[] = useMemo(() => {
    const out: CoverageLate[] = [];
    for (const house of data?.houses || []) {
      for (const l of house.late || []) {
        out.push({ ...l, houseId: house.id, houseName: house.name });
      }
    }
    return out;
  }, [data]);

  async function submitGapReport() {
    if (!reportGap || busy) return;
    setBusy(true);
    setMsg("");
    setError("");
    try {
      const when = reportGap.from && reportGap.to ? ` ${reportGap.from}–${reportGap.to}` : "";
      const head = `${reportGap.houseName || reportGap.houseId} · ${blockLabel(reportGap.block)}${when}`;
      const message = reportNote.trim() ? `${head}: ${reportNote.trim()}` : head;
      await api("/api/coverage/gap-report", {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      setMsg(c.reported);
      setReportGap(null);
      setDetail(null);
      setReportNote("");
      await load(true);
    } catch (e) {
      setError((e as Error).message || c.reportFail);
    } finally {
      setBusy(false);
    }
  }

  function openGap(g: CoverageGap) {
    setDetail(null);
    setReportGap(g);
    setReportNote("");
  }

  if (!ready) return <main className="page">{t("loading")}</main>;

  return (
    <>
      <PageShell eyebrow={c.eyebrow} title={c.title} lead={c.lead(displayDate)}>
        <section data-tour="tour-coverage">
          {error && (
            <div className="warn mb-3" role="alert">
              {error}
            </div>
          )}
          {msg && <p className="text-sm text-[var(--brand)] mb-3">{msg}</p>}

          {loading ? (
            <LoadingBlock label={c.loadingData} />
          ) : !data?.houses?.length ? (
            <EmptyState
              title={c.emptyTitle}
              hint={c.emptyHint}
              action={
                <div className="row gap-2">
                  <button className="btn-sec" type="button" onClick={() => load()}>
                    {c.retry}
                  </button>
                  <Link className="btn-sec" href="/plan">
                    {c.openPlan}
                  </Link>
                </div>
              }
            />
          ) : (
            <div className="list-panel">
              {(gaps.length > 0 || late.length > 0) && (
                <div className="list-sticky">
                  <span>{c.gapsLate(gaps.length, late.length)}</span>
                </div>
              )}
              {gaps.map((g, i) => (
                <div key={`gap-${g.houseId}-${g.block}-${i}`} className="list-row is-gap">
                  <button type="button" className="list-row__main" style={{ textAlign: "left" }} onClick={() => setDetail({ kind: "gap", gap: g })}>
                    <div className="list-row__title">
                      {c.gapTitle} · {g.houseName || g.houseId}
                    </div>
                    <div className="list-row__meta">
                      {blockLabel(g.block)}
                      {g.from && g.to ? ` · ${g.from}–${g.to}` : ""}
                    </div>
                  </button>
                  <button className="btn-sec" type="button" data-testid="gap-report-btn" onClick={() => openGap(g)}>
                    {c.report}
                  </button>
                </div>
              ))}
              {late.map((l) => (
                <button
                  key={`${l.houseId}-${l.profileId}`}
                  type="button"
                  className="list-row is-warn"
                  onClick={() => setDetail({ kind: "late", late: l })}
                >
                  <div className="list-row__main">
                    <div className="list-row__title">
                      {c.late} · {l.name || staffName(l.profileId)}
                    </div>
                    <div className="list-row__meta">
                      {l.houseName || l.houseId}
                      {l.reason ? ` · ${l.reason}` : ""}
                    </div>
                  </div>
                  <span aria-hidden>→</span>
                </button>
              ))}
              {data.houses.map((house) => {
                const entries = (house.entries || []).filter((e) => !e.cancelled);
                const present = (house.staffPresent || []).map(staffName);
                const empty = !entries.length && !(house.gaps || []).length && !(house.late || []).length;
                return (
                  <div key={house.id} data-testid={`lane-${house.id}`}>
                    <div className="list-sticky">{house.name}</div>
                    {entries.map((entry, idx) => {
                      const who = (entry.employeeIds || []).map(staffName).join(", ");
                      return (
                        <button
                          key={entry.id || `${house.id}-${entry.block}-${idx}`}
                          type="button"
                          className="list-row"
                          onClick={() => setDetail({ kind: "entry", house, entry })}
                        >
                          <div className="list-row__main">
                            <div className="list-row__title">
                              {blockLabel(entry.block)}
                              {entry.from && entry.to ? ` · ${entry.from}–${entry.to}` : ""}
                            </div>
                            <div className="list-row__meta">
                              {entry.activity ? `${entry.activity} · ` : ""}
                              {who || c.nobody}
                            </div>
                          </div>
                          <span aria-hidden>→</span>
                        </button>
                      );
                    })}
                    {present.length > 0 && (
                      <div className="list-row" style={{ cursor: "default" }}>
                        <div className="list-row__main">
                          <div className="list-row__title">
                            {c.present} · {present.length}
                          </div>
                          <div className="list-row__meta">{present.join(", ")}</div>
                        </div>
                      </div>
                    )}
                    {empty && (
                      <div className="list-row" style={{ cursor: "default" }}>
                        <div className="list-row__meta">{c.noBlocks}</div>
                      </div>
                    )}
                  </div>
                );
              })}
              {!gaps.length && (
                <div className="list-row" style={{ cursor: "default" }}>
                  <div className="list-row__main">
                    <div className="list-row__title">{c.allCovered}</div>
                    <div className="list-row__meta">{c.allCoveredMeta}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {detail && (
          <div className="more-overlay" role="presentation" onClick={() => setDetail(null)}>
            <div className="more-sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
              <header className="more-sheet-header">
                <h2>
                  {detail.kind === "gap"
                    ? `${c.gapTitle} · ${detail.gap.houseName || detail.gap.houseId}`
                    : detail.kind === "late"
                      ? `${c.late} · ${detail.late.name || staffName(detail.late.profileId)}`
                      : `${detail.house.name} · ${blockLabel(detail.entry.block)}`}
                </h2>
                <button type="button" className="more-sheet-close" onClick={() => setDetail(null)} aria-label={c.close}>
                  ✕
                </button>
              </header>
              {detail.kind === "gap" && (
                <div className="stack">
                  <p className="muted m-0">
                    {blockLabel(detail.gap.block)}
                    {detail.gap.from && detail.gap.to ? ` · ${detail.gap.from}–${detail.gap.to}` : ""}
                  </p>
                  <button className="btn w-full" type="button" onClick={() => openGap(detail.gap)}>
                    {c.report}
                  </button>
                </div>
              )}
              {detail.kind === "late" && (
                <p className="body-sm">
                  {detail.late.houseName || detail.late.houseId}
                  {detail.late.reason ? ` · ${detail.late.reason}` : ""}
                </p>
              )}
              {detail.kind === "entry" && (
                <div className="stack">
                  <p className="body-sm m-0">{detail.entry.activity || blockLabel(detail.entry.block)}</p>
                  <p className="muted text-sm m-0">
                    {c.staff}: {(detail.entry.employeeIds || []).map(staffName).join(", ") || c.nobody}
                  </p>
                  {detail.entry.from && detail.entry.to ? (
                    <p className="muted text-xs m-0">
                      {detail.entry.from}–{detail.entry.to}
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )}

        {reportGap && (
          <div className="more-overlay" role="presentation" onClick={() => !busy && setReportGap(null)}>
            <div
              className="more-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gap-title"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="more-sheet-header">
                <h2 id="gap-title">{c.gapTitle}</h2>
                <button type="button" className="more-sheet-close" onClick={() => setReportGap(null)} aria-label={c.close}>
                  ✕
                </button>
              </header>
              <div className="stack">
                <p className="muted m-0">
                  {reportGap.houseName || reportGap.houseId} · {blockLabel(reportGap.block)}
                  {reportGap.from && reportGap.to ? ` · ${reportGap.from}–${reportGap.to}` : ""}
                </p>
                <label htmlFor="gap-note">
                  {c.gapNote}
                  <textarea
                    id="gap-note"
                    rows={3}
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    placeholder={c.gapPh}
                  />
                </label>
                <button className="btn w-full" type="button" disabled={busy} onClick={submitGapReport}>
                  {busy ? c.sending : c.sendAdmin}
                </button>
              </div>
            </div>
          </div>
        )}
      </PageShell>
      <Dock />
      <GuidedTour mode="staff" admin={!!session?.admin} />
    </>
  );
}
