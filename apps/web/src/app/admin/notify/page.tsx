"use client";

import { FormEvent, useEffect, useState } from "react";
import { Dock } from "@/components/Dock";
import { PageShell } from "@/components/PageShell";
import { api, urlBase64ToUint8Array } from "@/lib/api";
import { getStoredLang, t, type Lang } from "@/lib/i18n";
import { useRequireMode } from "@/lib/session";

type Rule = {
  id: string;
  type?: string;
  kind?: string;
  enabled: boolean;
  schedule?: string;
  label?: string;
};

type DueItem = { kind?: string; title?: string; body?: string; url?: string };

const CATALOG: Record<string, { de: string; el: string }> = {
  shift_start: { de: "Schichtstart", el: "Έναρξη βάρδιας" },
  presence_late: { de: "Verspätung", el: "Καθυστέρηση" },
  low_stock: { de: "Niedriger Bestand", el: "Χαμηλό απόθεμα" },
  friday_list: { de: "Freitagsliste", el: "Λίστα Παρασκευής" },
  journal_due: { de: "Schichtbuch fällig", el: "Ημερολόγιο εκκρεμεί" },
  event_publish: { de: "Event veröffentlicht", el: "Εκδήλωση δημοσιεύτηκε" },
  meeting_notes_due: { de: "Besprechungsnotizen", el: "Σημειώσεις συνάντησης" },
  broadcast: { de: "Rundsendung", el: "Ανακοίνωση" },
  child_event: { de: "Kinder-Termin", el: "Παιδική εκδήλωση" },
};

export default function AdminNotifyPage() {
  const { session, ready } = useRequireMode("staff");
  const isAdmin = !!session?.admin;
  const [lang, setLang] = useState<Lang>("de");
  const [rules, setRules] = useState<Rule[]>([]);
  const [due, setDue] = useState<DueItem[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("staff");
  const [status, setStatus] = useState("");
  const [refOpen, setRefOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load() {
    const r = await api<{ rules: Rule[] }>("/api/notify/rules");
    setRules(r.rules || []);
  }

  useEffect(() => {
    if (!ready || !isAdmin) return;
    setLang(getStoredLang());
    load().catch((e) => setStatus((e as Error).message || t("errorDefault")));
  }, [ready, isAdmin]);

  async function toggle(rule: Rule) {
    if (busy) return;
    setBusy(true);
    setStatus("");
    try {
      await api(`/api/notify/rules/${rule.id}`, {
        method: "PATCH",
        body: JSON.stringify({ enabled: !rule.enabled }),
      });
      await load();
      setStatus(rule.enabled ? (lang === "el" ? "Απενεργοποιήθηκε" : "Aus") : lang === "el" ? "Ενεργό" : "An");
    } catch (e) {
      setStatus((e as Error).message || t("errorDefault", lang));
    } finally {
      setBusy(false);
    }
  }

  async function evaluate() {
    if (busy) return;
    setBusy(true);
    setStatus("");
    try {
      const r = await api<{ due: DueItem[] }>("/api/notify/evaluate", { method: "POST" });
      const items = r.due || [];
      setDue(items);
      setStatus(items.length ? `${items.length}` : lang === "el" ? "Τίποτα ληξιπρόθεσμο" : "Nichts fällig");
    } catch (e) {
      setStatus((e as Error).message || t("errorDefault", lang));
    } finally {
      setBusy(false);
    }
  }

  async function subscribePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus(lang === "el" ? "Το Push δεν είναι διαθέσιμο" : "Push nicht verfügbar");
      return;
    }
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      let key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
      if (!key) {
        const h = await api<{ vapidPublicKey?: string }>("/api/health");
        key = h.vapidPublicKey || "";
      }
      if (!key) {
        setStatus(lang === "el" ? "Λείπει το κλειδί VAPID" : "VAPID-Schlüssel fehlt");
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(lang === "el" ? "Ειδοποιήσεις απορρίφθηκαν" : "Benachrichtigung abgelehnt");
        return;
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key) as BufferSource,
      });
      await api("/api/notify/subscribe", {
        method: "POST",
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      setStatus(lang === "el" ? "Push ενεργό" : "Push aktiv");
    } catch {
      setStatus(lang === "el" ? "Αποτυχία Push" : "Push fehlgeschlagen");
    }
  }

  async function broadcast(e: FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      setStatus(lang === "el" ? "Θέμα και μήνυμα χρειάζονται" : "Betreff und Nachricht nötig");
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const aud = audience === "everyone" ? "all" : audience;
      const r = await api<{ ok: boolean; preview?: string }>("/api/notify/broadcast", {
        method: "POST",
        body: JSON.stringify({ subject, message: body, body, audience: aud, channels: ["email", "push", "banner"] }),
      });
      setStatus(r.ok ? r.preview || (lang === "el" ? "Σε ουρά" : "Rundsendung in Warteschlange") : t("errorDefault", lang));
      if (r.ok) {
        setSubject("");
        setBody("");
      }
    } catch (err) {
      setStatus((err as Error).message || t("errorDefault", lang));
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="page">{t("loading", lang)}</main>;

  if (!isAdmin) {
    return (
      <>
        <PageShell eyebrow="Admin" title={t("automations", lang)} lead={t("adminGate", lang)}>
          <p className="muted text-sm m-0" data-testid="admin-only">
            {t("adminGate", lang)}
          </p>
        </PageShell>
        <Dock />
      </>
    );
  }

  return (
    <>
      <PageShell eyebrow="Admin" title="Automationen" lead={lang === "el" ? "Υπενθυμίσεις, Push και ανακοινώσεις." : "Erinnerungen, Push und Rundsendungen."}>
        <section className="list-panel mb-3" data-tour="tour-admin">
          <div className="list-sticky">
            <span>{t("reminderCatalog", lang)}</span>
            <button type="button" className="btn-sec" style={{ minHeight: 36, fontSize: "0.75rem" }} onClick={() => setRefOpen((v) => !v)}>
              {refOpen ? (lang === "el" ? "Κλείσιμο" : "Zu") : lang === "el" ? "Αναφορά" : "Referenz"}
            </button>
          </div>
          {refOpen &&
            Object.entries(CATALOG).map(([id, label]) => (
              <div key={id} className="list-row">
                <div className="list-row__main">
                  <div className="list-row__title">{label[lang]}</div>
                  <div className="list-row__meta">{id}</div>
                </div>
              </div>
            ))}
          {rules.map((rule) => {
            const kind = rule.kind || rule.type || rule.id;
            const label = CATALOG[kind]?.[lang] || rule.label || kind;
            return (
              <div key={rule.id} className="list-row">
                <div className="list-row__main">
                  <div className="list-row__title">{label}</div>
                  <div className="list-row__meta">
                    {rule.enabled ? (lang === "el" ? "αν" : "an") : lang === "el" ? "off" : "aus"}
                    {rule.schedule ? ` · ${rule.schedule}` : ""}
                  </div>
                </div>
                <button className="btn-sec" type="button" onClick={() => toggle(rule)} disabled={busy}>
                  {t("toggle", lang)}
                </button>
              </div>
            );
          })}
        </section>

        <div className="row mb-3">
          <button className="btn" type="button" onClick={evaluate} disabled={busy}>
            {t("evaluateNow", lang)}
          </button>
          <button className="btn-sec" type="button" onClick={subscribePush} data-testid="admin-enable-push">
            {t("enablePush", lang)}
          </button>
        </div>

        {due.length > 0 && (
          <div className="list-panel mb-3">
            <div className="list-sticky">
              <span>{lang === "el" ? "Ληξιπρόθεσμα" : "Fällig jetzt"}</span>
              <span>{due.length}</span>
            </div>
            {due.map((d, i) => (
              <div key={i} className="list-row is-warn">
                <div className="list-row__main">
                  <div className="list-row__title">{d.title || d.kind || (lang === "el" ? "Εγγραφή" : "Eintrag")}</div>
                  <div className="list-row__meta">{d.body || d.url || ""}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {status && (
          <p className="muted text-sm mb-3" aria-live="polite">
            {status}
          </p>
        )}

        <section className="panel stack">
          <h2 className="text-base m-0">{t("broadcast", lang)}</h2>
          <form className="stack" onSubmit={broadcast}>
            <label>
              {lang === "el" ? "Παραλήπτες" : "Empfänger"}
              <select value={audience} onChange={(e) => setAudience(e.target.value)} aria-label={lang === "el" ? "Παραλήπτες" : "Empfänger"}>
                <option value="everyone">{t("everyone", lang)}</option>
                <option value="staff">{t("staff", lang)}</option>
                <option value="children">{t("children", lang)}</option>
              </select>
            </label>
            <label>
              {t("subject", lang)}
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t("subject", lang)} />
            </label>
            <label>
              {t("body", lang)}
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder={t("body", lang)} />
            </label>
            <button className="btn" type="submit" disabled={busy}>
              {t("send", lang)}
            </button>
          </form>
        </section>
      </PageShell>
      <Dock />
    </>
  );
}
