"use client";

import { useEffect, useMemo, useState } from "react";
import { Dock } from "@/components/Dock";
import { EmptyState, LoadingBlock } from "@/components/EmptyState";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

type CoverageStaff = {
  id: string;
  name: string;
  status?: "there" | "late" | "expected" | "missing";
  lateReason?: string;
};

type CoverageBlock = {
  block: string;
  from: string;
  to: string;
  staff: CoverageStaff[];
  gap?: boolean;
};

type CoverageLane = {
  id: string;
  name: string;
  blocks: CoverageBlock[];
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
  reason?: string;
};

type CoverageToday = {
  date: string;
  houses: CoverageLane[];
  gaps?: CoverageGap[];
  late?: CoverageLate[];
};

const BLOCK_LABEL: Record<string, string> = {
  morning: "Vormittag",
  afternoon: "Nachmittag",
  evening: "Abend",
};

const STATUS_LABEL: Record<string, string> = {
  there: "Da",
  late: "Verspätet",
  expected: "Erwartet",
  missing: "Fehlt",
};

export default function CoveragePage() {
  const { session, ready } = useRequireMode("staff");
  const [data, setData] = useState<CoverageToday | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reportGap, setReportGap] = useState<CoverageGap | null>(null);
  const [reportNote, setReportNote] = useState("");
  const [msg, setMsg] = useState("");

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const displayDate = useMemo(
    () => new Date(today + "T12:00:00").toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" }),
    [today],
  );

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api<CoverageToday>("/api/coverage/today");
      setData(res);
    } catch (e) {
      setError((e as Error).message || "Abdeckung konnte nicht geladen werden");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    load().catch(() => undefined);
  }, [ready]);

  async function submitGapReport() {
    if (!reportGap || busy) return;
    setBusy(true);
    setMsg("");
    setError("");
    try {
      await api("/api/coverage/gap-report", {
        method: "POST",
        body: JSON.stringify({
          houseId: reportGap.houseId,
          block: reportGap.block,
          note: reportNote.trim(),
        }),
      });
      setMsg("Lücke gemeldet — Admin wird informiert.");
      setReportGap(null);
      setReportNote("");
      await load();
    } catch (e) {
      setError((e as Error).message || "Meldung fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  const gaps = data?.gaps || [];
  const late = data?.late || [];

  if (!ready) return <main className="page">Laden…</main>;

  return (
    <>
      <PageShell
        eyebrow="Schicht"
        title="Abdeckung"
        lead={`${displayDate} — wer ist in welchem Haus?`}
      >
        <section data-tour="tour-coverage">
          {error && (
            <div className="warn mb-3" role="alert">
              {error}
            </div>
          )}
          {msg && <p className="text-sm text-[var(--brand)] mb-3">{msg}</p>}

          {(gaps.length > 0 || late.length > 0) && !loading && (
            <div className="grid gap-2 mb-4">
              {gaps.map((g, i) => (
                <div key={`gap-${i}`} className="card border-[var(--sun)]" style={{ background: "var(--amber-tint)" }}>
                  <div className="font-semibold text-[var(--warn)]">Lücke · {g.houseName || g.houseId}</div>
                  <div className="muted text-sm">
                    {BLOCK_LABEL[g.block] || g.block}
                    {g.from && g.to ? ` · ${g.from}–${g.to}` : ""}
                  </div>
                  <button
                    className="btn-sec !min-h-10 mt-2"
                    type="button"
                    onClick={() => setReportGap(g)}
                    data-testid="gap-report-btn"
                  >
                    Lücke melden
                  </button>
                </div>
              ))}
              {late.map((l) => (
                <div key={l.profileId} className="card border-[var(--sea)]" style={{ background: "var(--pine-tint)" }}>
                  <div className="font-semibold text-[var(--sea)]">Verspätet · {l.name}</div>
                  {l.reason && <div className="muted text-sm">{l.reason}</div>}
                </div>
              ))}
            </div>
          )}

          {loading ? (
            <LoadingBlock label="Abdeckung wird geladen…" />
          ) : !data?.houses?.length ? (
            <EmptyState
              title="Keine Abdeckungsdaten"
              hint="Für heute sind noch keine Haus-Spuren hinterlegt."
              action={
                <button className="btn-sec !min-h-10" type="button" onClick={() => load()}>
                  Erneut laden
                </button>
              }
            />
          ) : (
            <div className="grid gap-4">
              {data.houses.map((lane) => (
                <article key={lane.id} className="panel" data-testid={`lane-${lane.id}`}>
                  <header className="row between mb-3">
                    <h2 className="display-sm m-0 text-[var(--sea)]">{lane.name}</h2>
                    <span className="muted text-xs uppercase tracking-wide">{lane.id}</span>
                  </header>
                  <div className="grid gap-2">
                    {lane.blocks.map((block) => {
                      const hasGap = block.gap || gaps.some((g) => g.houseId === lane.id && g.block === block.block);
                      return (
                        <div
                          key={block.block}
                          className={`card ${hasGap ? "border-[var(--sun)]" : ""}`}
                          style={hasGap ? { background: "var(--amber-tint)" } : undefined}
                        >
                          <div className="row between">
                            <div>
                              <div className="font-semibold">{BLOCK_LABEL[block.block] || block.block}</div>
                              <div className="muted text-sm">
                                {block.from}–{block.to}
                              </div>
                            </div>
                            {hasGap && (
                              <span className="text-xs font-bold uppercase text-[var(--warn)]">Lücke</span>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {block.staff.length ? (
                              block.staff.map((s) => (
                                <span
                                  key={s.id}
                                  className={`chip ${s.status === "late" ? "on" : s.status === "missing" ? "" : ""}`}
                                  style={
                                    s.status === "missing"
                                      ? { borderColor: "var(--out)", color: "var(--out)" }
                                      : undefined
                                  }
                                >
                                  {s.name}
                                  {s.status && s.status !== "there" ? ` · ${STATUS_LABEL[s.status] || s.status}` : ""}
                                </span>
                              ))
                            ) : (
                              <span className="muted text-sm">Niemand eingeteilt</span>
                            )}
                          </div>
                          {hasGap && (
                            <button
                              className="btn-sec !min-h-10 mt-3 w-full"
                              type="button"
                              onClick={() =>
                                setReportGap({
                                  houseId: lane.id,
                                  houseName: lane.name,
                                  block: block.block,
                                  from: block.from,
                                  to: block.to,
                                })
                              }
                            >
                              Lücke melden
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && data?.houses?.length && gaps.length === 0 && (
            <div className="panel mt-4" style={{ background: "var(--pine-tint)" }}>
              <strong>Alle Häuser besetzt.</strong>
              <p className="muted m-0 mt-1">Keine offenen Lücken für heute.</p>
            </div>
          )}
        </section>

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
                <h2 id="gap-title">Lücke melden</h2>
                <button type="button" className="more-sheet-close" onClick={() => setReportGap(null)} aria-label="Schließen">
                  ✕
                </button>
              </header>
              <div className="stack">
                <p className="muted m-0">
                  {reportGap.houseName || reportGap.houseId} · {BLOCK_LABEL[reportGap.block] || reportGap.block}
                </p>
                <label htmlFor="gap-note">
                  Kurznotiz (optional)
                  <textarea
                    id="gap-note"
                    rows={3}
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    placeholder="z. B. Krankmeldung, Ausfall…"
                  />
                </label>
                <button className="btn w-full" type="button" disabled={busy} onClick={submitGapReport}>
                  {busy ? "Senden…" : "An Admin melden"}
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
