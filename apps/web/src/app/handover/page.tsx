"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Dock } from "@/components/Dock";
import { EmptyState, LoadingBlock } from "@/components/EmptyState";
import { PageShell } from "@/components/PageShell";
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
      <PageShell eyebrow="Schicht" title="Übergabe" lead={`${displayDate}`} back="/home">
        {error && (
          <div className="warn mb-3" role="alert">
            {error}
          </div>
        )}

        {done && (
          <EmptyState
            title="Übergabe gespeichert"
            hint="Eintrag im Schichtbuch und Talk · Übergabe."
            action={
              <Link href="/home" className="btn-sec">
                ← Zurück
              </Link>
            }
          />
        )}

        {!done && (
          <>
            {loading ? (
              <LoadingBlock label="Lade Schichtdaten…" />
            ) : !ribbon.length ? (
              <EmptyState title="Keine Übergabe-Daten" hint="Präsenz, Plan und Lager erscheinen hier, sobald verfügbar." />
            ) : (
              <div className="list-panel mb-3" data-testid="handover-ribbon" aria-label="Übergabe-Liste">
                <div className="list-sticky">
                  <span>Status</span>
                  <span>{ribbon.length}</span>
                </div>
                {ribbon.map((item) => {
                  const rowClass = item.tone === "warn" ? "list-row is-warn" : "list-row";
                  const body = (
                    <>
                      <div className="list-row__main">
                        <div className="list-row__title">
                          {KIND_LABEL[item.kind]} · {item.title}
                        </div>
                        <div className="list-row__meta">{item.body}</div>
                      </div>
                      {item.href ? <span aria-hidden>→</span> : null}
                    </>
                  );
                  return item.href ? (
                    <Link key={item.id} href={item.href} className={rowClass} data-testid={`ribbon-${item.kind}`}>
                      {body}
                    </Link>
                  ) : (
                    <div key={item.id} className={rowClass} style={{ cursor: "default" }} data-testid={`ribbon-${item.kind}`}>
                      {body}
                    </div>
                  );
                })}
              </div>
            )}

            <label htmlFor="handover-extra" className="block mb-3">
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

            <div className="sticky-footer">
              <button
                className="btn w-full"
                type="button"
                disabled={loading || busy || !ribbon.length}
                onClick={submit}
                data-testid="handover-complete"
              >
                {busy ? "Speichern…" : "Übergabe abschließen"}
              </button>
            </div>
          </>
        )}
      </PageShell>
      <Dock />
    </>
  );
}
