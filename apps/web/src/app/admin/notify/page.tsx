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

const CATALOG_DE: Record<string, string> = {
  shift_start: "Schichtstart",
  presence_late: "Verspätung",
  low_stock: "Niedriger Bestand",
  friday_list: "Freitagsliste",
  journal_due: "Schichtbuch fällig",
  event_publish: "Event veröffentlicht",
  meeting_notes_due: "Besprechungsnotizen",
  broadcast: "Rundsendung",
  child_event: "Kinder-Termin",
};

export default function AdminNotifyPage() {
  const { ready } = useRequireMode("staff");
  const [lang, setLang] = useState<Lang>("de");
  const [rules, setRules] = useState<Rule[]>([]);
  const [due, setDue] = useState<DueItem[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("staff");
  const [status, setStatus] = useState("");
  const [refOpen, setRefOpen] = useState(false);

  async function load() {
    const r = await api<{ rules: Rule[] }>("/api/notify/rules");
    setRules(r.rules || []);
  }

  useEffect(() => {
    if (!ready) return;
    setLang(getStoredLang());
    load().catch(() => {
      window.location.href = "/";
    });
  }, [ready]);

  async function toggle(rule: Rule) {
    await api(`/api/notify/rules/${rule.id}`, {
      method: "PATCH",
      body: JSON.stringify({ enabled: !rule.enabled }),
    });
    await load();
  }

  async function evaluate() {
    const r = await api<{ due: DueItem[] }>("/api/notify/evaluate", { method: "POST" });
    setDue(r.due || []);
  }

  async function subscribePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("Push nicht verfügbar");
      return;
    }
    const reg = await navigator.serviceWorker.register("/sw.js");
    let key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
    if (!key) {
      try {
        const h = await api<{ vapidPublicKey?: string }>("/api/health");
        key = h.vapidPublicKey || "";
      } catch {
        key = "";
      }
    }
    if (!key) {
      setStatus("VAPID-Schlüssel fehlt (Server /api/health)");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("Benachrichtigung abgelehnt");
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
      setStatus("Push aktiv");
    } catch {
      setStatus("Push fehlgeschlagen");
    }
  }

  async function broadcast(e: FormEvent) {
    e.preventDefault();
    const aud = audience === "everyone" ? "all" : audience;
    const r = await api<{ ok: boolean; preview?: string }>("/api/notify/broadcast", {
      method: "POST",
      body: JSON.stringify({ subject, message: body, body, audience: aud, channels: ["email", "push", "banner"] }),
    });
    setStatus(r.ok ? r.preview || "Rundsendung in Warteschlange" : "Fehlgeschlagen");
  }

  if (!ready) return <main className="page">{t("loading", lang)}</main>;

  return (
    <>
      <PageShell eyebrow="Admin" title="Automationen" lead="Erinnerungen, Push und Rundsendungen.">
        <section className="list-panel mb-3" data-tour="tour-admin">
          <div className="list-sticky">
            <span>{t("reminderCatalog", lang)}</span>
            <button type="button" className="btn-sec" style={{ minHeight: 36, fontSize: "0.75rem" }} onClick={() => setRefOpen((v) => !v)}>
              {refOpen ? "Zu" : "Referenz"}
            </button>
          </div>
          {refOpen &&
            Object.entries(CATALOG_DE).map(([id, label]) => (
              <div key={id} className="list-row">
                <div className="list-row__main">
                  <div className="list-row__title">{label}</div>
                  <div className="list-row__meta">{id}</div>
                </div>
              </div>
            ))}
          {rules.map((rule) => {
            const kind = rule.kind || rule.type || rule.id;
            const label = rule.label || CATALOG_DE[kind] || kind;
            return (
              <div key={rule.id} className="list-row">
                <div className="list-row__main">
                  <div className="list-row__title">{label}</div>
                  <div className="list-row__meta">
                    {rule.enabled ? "an" : "aus"}
                    {rule.schedule ? ` · ${rule.schedule}` : ""}
                  </div>
                </div>
                <button className="btn-sec" type="button" onClick={() => toggle(rule)}>
                  {t("toggle", lang)}
                </button>
              </div>
            );
          })}
        </section>

        <div className="row mb-3">
          <button className="btn" type="button" onClick={evaluate}>
            {t("evaluateNow", lang)}
          </button>
          <button className="btn-sec" type="button" onClick={subscribePush} data-testid="admin-enable-push">
            {t("enablePush", lang)}
          </button>
        </div>

        {due.length > 0 && (
          <div className="list-panel mb-3">
            <div className="list-sticky">
              <span>Fällig jetzt</span>
              <span>{due.length}</span>
            </div>
            {due.map((d, i) => (
              <div key={i} className="list-row is-warn">
                <div className="list-row__main">
                  <div className="list-row__title">{d.title || d.kind || "Eintrag"}</div>
                  <div className="list-row__meta">{d.body || d.url || ""}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {status && <p className="muted text-sm mb-3">{status}</p>}

        <section className="panel stack">
          <h2 className="text-base m-0">{t("broadcast", lang)}</h2>
          <form className="stack" onSubmit={broadcast}>
            <label>
              Empfänger
              <select value={audience} onChange={(e) => setAudience(e.target.value)} aria-label="Empfänger">
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
            <button className="btn" type="submit">
              {t("send", lang)}
            </button>
          </form>
        </section>
      </PageShell>
      <Dock />
    </>
  );
}
