"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Dock } from "@/components/Dock";
import { EmptyState, LoadingBlock } from "@/components/EmptyState";
import { PageShell } from "@/components/PageShell";
import { api } from "@/lib/api";
import {
  buildHandoverSummary,
  buildRibbon,
  completeHandover,
  fetchHandoverData,
  loadHandoverSession,
  type RibbonItem,
} from "@/lib/handover";
import { t, useLang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

const KIND: Record<RibbonItem["kind"], { de: string; el: string }> = {
  presence: { de: "Präsenz", el: "Παρουσία" },
  plan: { de: "Plan", el: "Πρόγραμμα" },
  stock: { de: "Lager", el: "Αποθήκη" },
  shop: { de: "Liste", el: "Λίστα" },
  journal: { de: "Buch", el: "Βιβλίο" },
  notify: { de: "Hinweis", el: "Ειδοποίηση" },
};

const COPY = {
  de: {
    eyebrow: "Schicht",
    title: "Übergabe",
    lead: (d: string) => `${d} — Status für die nächste Betreuung.`,
    extra: "Zusatz für die Übergabe",
    extraPh: "Besonderes für die nächste Schicht…",
    complete: "Übergabe abschließen",
    saving: "Speichern…",
    doneTitle: "Übergabe gespeichert",
    doneMeta: "Eintrag im Schichtbuch und Talk · Übergabe.",
    emptyTitle: "Keine Übergabe-Daten",
    emptyHint: "Präsenz, Plan und Lager erscheinen hier, sobald verfügbar.",
    retry: "Erneut laden",
    loadFail: "Laden fehlgeschlagen",
    saveFail: "Speichern fehlgeschlagen",
    noProfile: "Kein Profil",
    loadingData: "Lade Schichtdaten…",
    ribbon: "Übergabe-Liste",
    status: "Status",
    draftBtn: "Entwurf erstellen",
    drafting: "Entwurf wird erstellt…",
    draftFail: "Entwurf konnte nicht erstellt werden",
  },
  el: {
    eyebrow: "Βάρδια",
    title: "Παράδοση",
    lead: (d: string) => `${d} — κατάσταση για την επόμενη φροντίδα.`,
    extra: "Σημείωση για την παράδοση",
    extraPh: "Κάτι ιδιαίτερο για την επόμενη βάρδια…",
    complete: "Ολοκλήρωση παράδοσης",
    saving: "Αποθήκευση…",
    doneTitle: "Η παράδοση αποθηκεύτηκε",
    doneMeta: "Καταχώριση στο βιβλίο βάρδιας και Talk · Παράδοση.",
    emptyTitle: "Δεν υπάρχουν δεδομένα παράδοσης",
    emptyHint: "Παρουσία, πρόγραμμα και αποθήκη εμφανίζονται εδώ όταν υπάρχουν.",
    retry: "Ξανά φόρτωση",
    loadFail: "Η φόρτωση απέτυχε",
    saveFail: "Η αποθήκευση απέτυχε",
    noProfile: "Δεν υπάρχει προφίλ",
    loadingData: "Φόρτωση δεδομένων βάρδιας…",
    ribbon: "Λίστα παράδοσης",
    status: "Κατάσταση",
    draftBtn: "Δημιουργία πρόχειρου",
    drafting: "Δημιουργία πρόχειρου…",
    draftFail: "Δεν ήταν δυνατή η δημιουργία πρόχειρου",
  },
} as const;

export default function HandoverPage() {
  const { session, ready } = useRequireMode("staff");
  const [lang] = useLang();
  const c = COPY[lang];
  const [ribbon, setRibbon] = useState<RibbonItem[]>([]);
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

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

  async function load() {
    setLoading(true);
    setError("");
    try {
      const s = await loadHandoverSession();
      if (!s.profileId) throw new Error(c.noProfile);
      const data = await fetchHandoverData(today, s.profileId);
      setRibbon(buildRibbon(data));
    } catch (e) {
      setError((e as Error).message || c.loadFail);
      setRibbon([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    load().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload on session/date
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
      setError((e as Error).message || c.saveFail);
    } finally {
      setBusy(false);
    }
  }

  async function draftHandover() {
    if (drafting || busy) return;
    setDrafting(true);
    setError("");
    try {
      const ribbonSummary = ribbon
        .map((item) => `${KIND[item.kind][lang]}: ${item.title} — ${item.body}`)
        .join("\n");
      const systemPrompt =
        lang === "el"
          ? `Είσαι βοηθός παράδοσης βάρδιας. Με βάση τα παρακάτω δεδομένα βάρδιας, γράψε ένα σύντομο πρόχειρο παράδοσης (3-6 προτάσεις) για την επόμενη βάρδια. Χρησιμοποίησε μόνο τα δεδομένα που σου δίνονται.\n\nΔεδομένα βάρδιας (${today}):\n${ribbonSummary}`
          : `Du bist ein Schichtübergabe-Assistent. Basierend auf den folgenden Schichtdaten schreibe einen kurzen Übergabe-Entwurf (3-6 Sätze) für die nächste Betreuung. Verwende nur die angegebenen Daten.\n\nSchichtdaten (${today}):\n${ribbonSummary}`;
      const res = await api<{ reply?: string; message?: string }>("/api/zoai/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: systemPrompt }],
          mode: "handover_draft",
        }),
      });
      const draft = res.reply || res.message || "";
      if (draft) {
        setExtra((prev) => (prev ? prev + "\n\n" + draft : draft));
      }
    } catch (e) {
      setError((e as Error).message || c.draftFail);
    } finally {
      setDrafting(false);
    }
  }

  if (!ready) return <main className="page">{t("loading")}</main>;

  return (
    <>
      <PageShell eyebrow={c.eyebrow} title={c.title} lead={c.lead(displayDate)}>
        {error && (
          <div className="warn mb-3" role="alert">
            {error}
          </div>
        )}

        {done && (
          <div className="list-panel mb-3" data-testid="handover-done">
            <div className="list-row" style={{ cursor: "default" }}>
              <div className="list-row__main">
                <div className="list-row__title">{c.doneTitle}</div>
                <div className="list-row__meta">{c.doneMeta}</div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <LoadingBlock label={c.loadingData} />
        ) : !ribbon.length ? (
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
          <div className="list-panel mb-3" data-testid="handover-ribbon" aria-label={c.ribbon}>
            <div className="list-sticky">
              <span>{c.status}</span>
              <span>{ribbon.length}</span>
            </div>
            {ribbon.map((item) => {
              const rowClass = item.tone === "warn" ? "list-row is-warn" : "list-row";
              const kind = KIND[item.kind][lang];
              const body = (
                <>
                  <div className="list-row__main">
                    <div className="list-row__title">
                      {kind} · {item.title}
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

        <div className="mb-2">
          <button
            type="button"
            className="btn-sec"
            disabled={loading || drafting || busy || !ribbon.length}
            onClick={draftHandover}
            data-testid="handover-draft"
          >
            {drafting ? c.drafting : c.draftBtn}
          </button>
        </div>

        <label htmlFor="handover-extra" className="block mb-3">
          {c.extra}
          <textarea
            id="handover-extra"
            rows={3}
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder={c.extraPh}
            data-testid="handover-extra"
          />
        </label>

        <div className="sticky-footer">
          <button
            className="btn w-full"
            type="button"
            disabled={loading || busy || (!ribbon.length && !extra.trim())}
            onClick={submit}
            data-testid="handover-complete"
          >
            {busy ? c.saving : c.complete}
          </button>
        </div>
      </PageShell>
      <Dock />
    </>
  );
}
