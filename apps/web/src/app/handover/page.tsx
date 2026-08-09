"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Dock } from "@/components/Dock";
import {
  buildHandoverSummary,
  buildRibbon,
  completeHandover,
  fetchHandoverData,
  loadHandoverSession,
  type RibbonItem,
} from "@/lib/handover";
import { useRequireMode } from "@/lib/session";

const KIND_LABEL: Record<RibbonItem["kind"], string> = {
  presence: "Präsenz",
  plan: "Plan",
  stock: "Lager",
  shop: "Liste",
  journal: "Buch",
  notify: "Hinweis",
};

export default function HandoverPage() {
  const { session, ready } = useRequireMode("staff");
  const [ribbon, setRibbon] = useState<RibbonItem[]>([]);
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const displayDate = useMemo(
    () => new Date(today + "T12:00:00").toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" }),
    [today],
  );

  useEffect(() => {
    if (!ready) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const s = await loadHandoverSession();
        if (!s.profileId) throw new Error("Kein Profil");
        const data = await fetchHandoverData(today, s.profileId);
        setRibbon(buildRibbon(data));
      } catch (e) {
        setError((e as Error).message || "Laden fehlgeschlagen");
      } finally {
        setLoading(false);
      }
    })();
  }, [ready, today]);

  async function submit() {
    if (busy || !session?.profileId) return;
    setBusy(true);
    setError("");
    try {
      const name = session.nickname || session.name || "Team";
      const summary = buildHandoverSummary(today, name, ribbon, extra);
      await completeHandover(today, summary);
      setDone(true);
      setExtra("");
    } catch (e) {
      setError((e as Error).message || "Speichern fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">Laden…</main>;

  return (
    <>
      <main className="page handover-page">
        <header className="handover-hero">
          <p className="eyebrow">Armonia · Thassos</p>
          <h1 className="handover-title">Übergabe</h1>
          <p className="handover-lead">{displayDate}</p>
          <p className="handover-sub muted">
            Schicht-Status auf einen Blick — für die nächste Betreuung.
          </p>
        </header>

        {error && (
          <div className="warn" role="alert">
            {error}
          </div>
        )}

        {done && (
          <div className="panel" data-testid="handover-done">
            <strong>Übergabe gespeichert.</strong>
            <p className="muted m-0 mt-1">Eintrag im Schichtbuch und Talk (handover).</p>
          </div>
        )}

        <section className="ribbon" aria-label="Übergabe-Zeitleiste" data-testid="handover-ribbon">
          {loading ? (
            <p className="muted">Lade Schichtdaten…</p>
          ) : (
            ribbon.map((item, i) => (
              <article key={item.id} className={`ribbon-item tone-${item.tone || "muted"}`} data-testid={`ribbon-${item.kind}`}>
                <div className="ribbon-rail" aria-hidden>
                  <span className="ribbon-dot" />
                  {i < ribbon.length - 1 && <span className="ribbon-line" />}
                </div>
                <div className="ribbon-body">
                  <div className="ribbon-meta">
                    <span className="ribbon-kind">{KIND_LABEL[item.kind]}</span>
                    {item.href && (
                      <Link href={item.href} className="ribbon-link">
                        Öffnen →
                      </Link>
                    )}
                  </div>
                  <h2 className="ribbon-title">{item.title}</h2>
                  <p className="ribbon-text">{item.body}</p>
                </div>
              </article>
            ))
          )}
        </section>

        <section className="panel stack">
          <label htmlFor="handover-extra">
            Zusatz für die Übergabe
            <textarea
              id="handover-extra"
              rows={3}
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="Besonderes für die nächste Schicht…"
              data-testid="handover-extra"
            />
          </label>
          <button
            className="btn w-full"
            type="button"
            disabled={loading || busy || !ribbon.length}
            onClick={submit}
            data-testid="handover-complete"
          >
            {busy ? "Speichern…" : "Übergabe abschließen"}
          </button>
        </section>
      </main>
      <Dock />
    </>
  );
}
