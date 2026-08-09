"use client";

import { useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { GuidedTour } from "@/components/GuidedTour";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import { useRequireMode } from "@/lib/session";

type Day = {
  date: string;
  entries: Array<{ id: string; activity: string; from: string; to: string; block: string }>;
  issues: Array<{ message: string }>;
};

function mondayISO(d = new Date()) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x.toISOString().slice(0, 10);
}

export default function PlanPage() {
  const { ready } = useRequireMode("staff");
  const [start, setStart] = useState(mondayISO());
  const [days, setDays] = useState<Day[]>([]);
  const [activity, setActivity] = useState("Betreuung");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [overrideReason, setOverrideReason] = useState("");
  const [warn, setWarn] = useState("");

  async function load() {
    const data = await api<{ days: Day[] }>(`/api/schedule/week?start=${start}`);
    setDays(data.days || []);
  }

  useEffect(() => {
    if (!ready) return;
    load().catch(console.error);
  }, [ready, start]);

  async function addEntry(force = false) {
    setWarn("");
    try {
      await api("/api/schedule/entry", {
        method: "POST",
        body: JSON.stringify({
          date,
          block: "morning",
          activity,
          houseIds: ["h1", "h2"],
          employeeIds: ["e1"],
          force,
          overrideReason: force ? overrideReason || "Override" : overrideReason,
        }),
      });
      setOverrideReason("");
      await load();
    } catch (err) {
      const e = err as Error & { data?: { detail?: { issues?: Array<{ message: string }> } } };
      const issues = e.data?.detail?.issues || [];
      setWarn(issues.map((i) => i.message).join(" · ") || e.message);
    }
  }

  if (!ready) return <main className="page">Laden…</main>;

  return (
    <>
      <PageShell
        eyebrow="Plan"
        title="Wochenplan"
        lead="Jeder Tag mit Datum — mobil als Karten, Desktop als Raster."
        actions={
          <>
            <button className="btn-sec !min-h-10" type="button" data-testid="week-prev" onClick={() => setStart(mondayISO(new Date(Date.parse(start) - 7 * 86400000)))}>
              ← Woche
            </button>
            <button className="btn-sec !min-h-10" type="button" data-testid="week-today" onClick={() => setStart(mondayISO())}>
              Heute
            </button>
            <button className="btn-sec !min-h-10" type="button" data-testid="week-next" onClick={() => setStart(mondayISO(new Date(Date.parse(start) + 7 * 86400000)))}>
              Woche →
            </button>
          </>
        }
      >
        <div className="week-scroll hidden md:block" data-tour="tour-plan">
          <div className="week-grid">
            <div className="week-head">Block</div>
            {days.map((d) => {
              const dt = new Date(d.date + "T12:00:00");
              return (
                <div key={d.date} className="week-head">
                  <div className="uppercase text-[var(--muted)]">{dt.toLocaleDateString("de-DE", { weekday: "short" })}</div>
                  <div className="text-sm text-[var(--sea)]">
                    {dt.getDate()}.{dt.getMonth() + 1}.{dt.getFullYear()}
                  </div>
                </div>
              );
            })}
            {["morning", "afternoon", "evening"].map((block) => (
              <div key={block} className="contents">
                <div className="week-cell font-semibold capitalize">{block}</div>
                {days.map((d) => (
                  <div key={d.date + block} className="week-cell">
                    {d.entries
                      .filter((e) => e.block === block)
                      .map((e) => (
                        <div key={e.id} className="mb-1 rounded-lg bg-[rgba(42,107,82,0.1)] px-2 py-1 text-xs">
                          {e.activity} · {e.from}-{e.to}
                        </div>
                      ))}
                    {!d.entries.filter((e) => e.block === block).length && <span className="muted text-xs">—</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="panel stack mt-4">
          <h2 className="text-lg m-0">Eintrag hinzufügen</h2>
          <div className="grid-even-2">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} data-testid="plan-date" />
            <input value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="Aktivität" data-testid="plan-activity" />
          </div>
          <button className="btn" type="button" data-testid="plan-save" onClick={() => addEntry(false)}>
            Speichern
          </button>
          {warn && (
            <div className="stack">
              <p className="warn">⚠ {warn}</p>
              <input
                placeholder="Override-Grund"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                data-testid="plan-override"
              />
              <button className="btn-sec" type="button" data-testid="plan-force" onClick={() => addEntry(true)} disabled={!overrideReason.trim()}>
                Trotzdem speichern
              </button>
            </div>
          )}
        </section>

        <div className="grid-even mt-4 md:hidden">
          {days.map((d) => {
            const dt = new Date(d.date + "T12:00:00");
            return (
              <article key={d.date} className="tile">
                <div>
                  <h3 className="m-0 font-semibold">
                    {dt.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "numeric", year: "numeric" })}
                  </h3>
                  {d.entries.length ? (
                    d.entries.map((e) => (
                      <div key={e.id} className="mt-2 text-sm">
                        {e.activity} · {e.from}-{e.to}
                      </div>
                    ))
                  ) : (
                    <p className="muted mt-2">Noch nichts</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </PageShell>
      <Dock />
      <GuidedTour />
    </>
  );
}
