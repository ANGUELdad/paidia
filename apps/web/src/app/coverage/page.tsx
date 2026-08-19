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
        back="/home"
      >
        <section data-tour="tour-coverage">
          {error && (
            <div className="warn mb-3" role="alert">
              {error}
            </div>
          )}
          {msg && <p className="text-sm text-[var(--brand)] mb-3">{msg}</p>}

          {loading ? (
            <LoadingBlock label="Abdeckung wird geladen…" />
          ) : !data?.houses?.length ? (
            <EmptyState
              title="Keine Abdeckungsdaten"
              hint="Für heute sind noch keine Haus-Spuren hinterlegt."
              action={
                <button className="btn-sec" type="button" onClick={() => load()}>
                  Erneut laden
                </button>
              }
            />
          ) : (
            <div className="list-panel">
              {(gaps.length > 0 || late.length > 0) && (
                <div className="list-sticky">
                  <span>
                    {gaps.length} Lücken · {late.length} verspätet
                  </span>
                </div>
              )}
              {gaps.map((g, i) => (
                <div key={`gap-${i}`} className="list-row is-gap">
                  <div className="list-row__main">
                    <div className="list-row__title">
                      Lücke · {g.houseName || g.houseId}
                    </div>
                    <div className="list-row__meta">
                      {BLOCK_LABEL[g.block] || g.block}
                      {g.from && g.to ? ` · ${g.from}–${g.to}` : ""}
                    </div>
                  </div>
                  <button className="btn-sec" type="button" data-testid="gap-report-btn" onClick={() => setReportGap(g)}>
                    Melden
                  </button>
                </div>
              ))}
              {late.map((l) => (
                <div key={l.profileId} className="list-row is-warn">
                  <div className="list-row__main">
                    <div className="list-row__title">Verspätet · {l.name}</div>
                    <div className="list-row__meta">{l.reason || "—"}</div>
                  </div>
                </div>
              ))}
              {data.houses.map((lane) => (
                <div key={lane.id} data-testid={`lane-${lane.id}`}>
                  <div className="list-sticky">{lane.name}</div>
                  {(lane.blocks || []).map((block) => {
                    const hasGap = block.gap || gaps.some((g) => g.houseId === lane.id && g.block === block.block);
                    const names = (block.staff || [])
                      .map((s) => `${s.name}${s.status && s.status !== "there" ? ` (${STATUS_LABEL[s.status] || s.status})` : ""}`)
                      .join(", ");
                    return (
                      <div key={block.block} className={`list-row ${hasGap ? "is-gap" : ""}`}>
                        <div className="list-row__main">
                          <div className="list-row__title">
                            {BLOCK_LABEL[block.block] || block.block} · {block.from}–{block.to}
                          </div>
                          <div className="list-row__meta">{names || "Niemand eingeteilt"}</div>
                        </div>
                        {hasGap && (
                          <button
                            className="btn-sec"
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
                            Melden
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {!(lane.blocks || []).length && (
                    <div className="list-row" style={{ cursor: "default" }}>
                      <div className="list-row__meta">Keine Blöcke für dieses Haus</div>
                    </div>
                  )}
                </div>
              ))}
              {!gaps.length && !late.length && (
                <div className="list-row" style={{ cursor: "default" }}>
                  <div className="list-row__main">
                    <div className="list-row__title">Alle Häuser besetzt</div>
                    <div className="list-row__meta">Keine offenen Lücken oder Verspätungen</div>
                  </div>
                </div>
              )}
              {!gaps.length && late.length > 0 && (
                <div className="list-row" style={{ cursor: "default" }}>
                  <div className="list-row__main">
                    <div className="list-row__title">Häuser belegt</div>
                    <div className="list-row__meta">{late.length} Verspätung(en) oben beachten</div>
                  </div>
                </div>
              )}
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
